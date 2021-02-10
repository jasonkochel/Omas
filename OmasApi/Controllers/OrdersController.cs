using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using OmasApi.Controllers.Middleware;
using OmasApi.Data.Entities;
using OmasApi.Data.Repositories;
using OmasApi.Models;
using OmasApi.Services;

namespace OmasApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly OrderRepository _repo;
        private readonly OrderLineRepository _lineRepo;
        private readonly CatalogItemRepository _itemRepo;
        private readonly OrderBatchRepository _batchRepo;
        private readonly CatalogItemRepository _catalogItemRepo;

        private readonly UserIdentity _identity;
        private readonly UserService _userService;
        private readonly OrderBatchService _orderBatchService;
        private readonly EmailService _emailService;

        public OrdersController(OrderRepository repo, OrderLineRepository lineRepo, UserIdentity identity, UserService userService,
            OrderBatchService orderBatchService, EmailService emailService,
            CatalogItemRepository itemRepo, OrderBatchRepository batchRepo, CatalogItemRepository catalogItemRepo)
        {
            _repo = repo;
            _lineRepo = lineRepo;

            _identity = identity;
            _userService = userService;
            _orderBatchService = orderBatchService;
            _emailService = emailService;
            _itemRepo = itemRepo;
            _batchRepo = batchRepo;
            _catalogItemRepo = catalogItemRepo;
        }

        [HttpGet]
        public async Task<List<OrderHistoryModel>> GetHistoryForUser()
        {
            var userId = await GetUserId();

            var orders = await _repo.GetAllForUser(userId);

            return orders
                .OrderByDescending(h => h.DeliveryDate)
                .Select(o => new OrderHistoryModel
                {
                    BatchId = o.BatchId,
                    DeliveryDate = o.DeliveryDate,
                    Total = o.SubTotal + o.Tax + o.Shipping
                })
                .ToList();
        }

        [HttpGet("current")]
        public async Task<Order> GetCurrentOrderForUser()
        {
            return await GetOrderForUser(_orderBatchService.CurrentBatchId);
        }

        [HttpGet("{batchId}")]
        public async Task<Order> GetOrderForUser([FromRoute] string batchId)
        {
            var userId = await GetUserId();
            return await _repo.Get(batchId, userId, includeNavigationProperties: true, includeLineItems: true);
        }

        [HttpPut("confirm")]
        public async Task<Order> ConfirmOrder()
        {
            var userId = await GetUserId();
            var batchId = _orderBatchService.CurrentBatchId;

            var order = await _repo.Get(batchId, userId, includeNavigationProperties: false);

            if (order != null)
            {
                order.Confirmed = true;
                await _repo.Put(order);

                try
                {
                    await _emailService.EmailOrderForUser(batchId, userId);
                }
                catch (Exception e)
                {
                    Debug.Print($"Exception during email send: {e.Message}");
                }
            }

            return order;
        }

        [HttpPost("lineItems")]
        public async Task UpdateCart([FromBody] List<OrderLineInputModel> model)
        {
            var userId = await GetUserId();
            var batchId = _orderBatchService.CurrentBatchId;

            var newLineItems = new List<OrderLine>();

            foreach (var line in model)
            {
                var catalogItem = await _itemRepo.GetBySku(line.Sku);

                if (catalogItem == null)
                {
                    throw new BadRequestException($"SKU '{line.Sku}' does not exist");
                }

                if (line.Quantity > 0)
                {
                    newLineItems.Add(new OrderLine
                    {
                        BatchId = batchId,
                        UserId = userId,
                        UserId_Sku = $"{userId}#{catalogItem.Sku}",
                        Multiplier = catalogItem.Multiplier,
                        Name = catalogItem.Name,
                        OrderPer = catalogItem.OrderPer,
                        Price = catalogItem.Price,
                        PricePer = catalogItem.PricePer,
                        Quantity = line.Quantity,
                        Sku = catalogItem.Sku,
                        Weight = catalogItem.Weight,
                        Sequence = catalogItem.Sequence
                    });
                }
            }

            await CreateOrderIfNoneExists(batchId, userId);     // upsert header record
            await _lineRepo.DeleteByOrder(batchId, userId);     // delete old
            await _lineRepo.PutMany(newLineItems);              // insert new

            await UpdateOrderHeader(batchId, userId);
        }

        [HttpPost("{batchId}/clone")]
        public async Task CloneFromHistory([FromRoute] string batchId)
        {
            var userId = await GetUserId();
            var currentBatchId = _orderBatchService.CurrentBatchId;

            var currentOrderLines = await _lineRepo.GetByOrder(currentBatchId, userId);
            var linesToClone = await _lineRepo.GetByOrder(batchId, userId);

            if (linesToClone.Any())
            {
                await CreateOrderIfNoneExists(currentBatchId, userId);

                foreach (var line in linesToClone)
                {
                    var existingLine = currentOrderLines.SingleOrDefault(l => l.Sku == line.Sku);

                    if (existingLine == null)
                    {
                        var catalogItem = await _catalogItemRepo.GetBySku(line.Sku);

                        var newOrderLine = new OrderLine
                        {
                            BatchId = currentBatchId,
                            UserId_Sku = $"{userId}#{line.Sku}",
                            UserId = userId,
                            Sku = line.Sku,
                            Quantity = line.Quantity,
                            Name = catalogItem.Name,
                            Multiplier = catalogItem.Multiplier,
                            OrderPer = catalogItem.OrderPer,
                            PricePer = catalogItem.PricePer,
                            Price = catalogItem.Price,
                            Weight = catalogItem.Weight,
                            Sequence = catalogItem.Sequence
                        };

                        await _lineRepo.Put(newOrderLine);
                    }
                    else
                    {
                        existingLine.Quantity += line.Quantity;
                        await _lineRepo.Put(existingLine);
                    }
                }

                await UpdateOrderHeader(currentBatchId, userId);
            }
        }

        private async Task<string> GetUserId()
        {
            var user = await _userService.GetByCognitoId(_identity.CognitoId);
            return user.ImpersonatingUserId ?? user.UserId;
        }

        private async Task CreateOrderIfNoneExists(string batchId, string userId)
        {
            var order = await _repo.Get(batchId, userId, includeNavigationProperties: false);

            if (order == null)
            {
                var batch = await _batchRepo.Get(batchId);

                await _repo.Put(new Order
                {
                    BatchId = batchId,
                    UserId = userId,
                    Confirmed = false,
                    OrderDate = batch.OrderDate,
                    DeliveryDate = batch.DeliveryDate
                });
            }
        }

        private async Task UpdateOrderHeader(string batchId, string userId)
        {
            var batch = await _batchRepo.Get(batchId);
            var order = await _repo.Get(batchId, userId, includeLineItems: true, includeNavigationProperties: false);

            var subTotal = order.LineItems.Sum(l => l.Price * l.Quantity * l.Multiplier);
            var weight = order.LineItems.Sum(l => l.Weight * l.Quantity);

            order.SubTotal = subTotal;
            order.Tax = decimal.Round(subTotal * (batch.TaxRate / 100.0M), 2);
            order.Shipping = decimal.Round(weight * batch.ShippingRate, 2);

            await _repo.Put(order);
        }
    }
}