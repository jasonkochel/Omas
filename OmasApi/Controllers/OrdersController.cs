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
                .Select(b => new OrderHistoryModel
                {
                    BatchId = b.BatchId,
                    DeliveryDate = b.DeliveryDate,
                    //Total = b.Orders.SingleOrDefault(o => o.UserId == userId).LineItems.Sum(i => i.Price * i.Quantity)
                })
                .OrderByDescending(h => h.DeliveryDate)
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

        [HttpPut]
        public async Task UpdateCart([FromQuery] string catalogId, [FromQuery] int quantity)
        {
            var userId = await GetUserId();
            var batchId = _orderBatchService.CurrentBatchId;

            var catalogItem = await _itemRepo.Get(catalogId);

            if (catalogItem == null)
            {
                throw new BadRequestException($"Catalog Item ID '{catalogId}' does not exist");
            }

            var orderLine = await _lineRepo.Get(batchId, userId, catalogItem.Sku);

            // Delete
            if (quantity == 0 && orderLine != null)
            {
                await _lineRepo.Delete(orderLine);
            }

            if (quantity > 0)
            {
                if (orderLine == null)
                {
                    // Might be first line item of order; make sure header record exists
                    await CreateOrderIfNoneExists(batchId, userId);

                    // Insert
                    orderLine = new OrderLine
                    {
                        BatchId = batchId,
                        UserId = userId,
                        UserId_Sku = $"{userId}#{catalogItem.Sku}",
                        Multiplier = catalogItem.Multiplier,
                        Name = catalogItem.Name,
                        OrderPer = catalogItem.OrderPer,
                        Price = catalogItem.Price,
                        PricePer = catalogItem.PricePer,
                        Quantity = quantity,
                        Sku = catalogItem.Sku,
                        Weight = catalogItem.Weight,
                        Sequence = catalogItem.Sequence
                    };
                }
                else
                {
                    // Update
                    orderLine.Quantity = quantity;
                }

                await _lineRepo.Put(orderLine);
            }
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
                order = new Order
                {
                    BatchId = batchId,
                    UserId = userId,
                    Confirmed = false,
                    OrderDate = batch.OrderDate,
                    DeliveryDate = batch.DeliveryDate
                };

                await _repo.Put(order);
            }
        }
    }
}