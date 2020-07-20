using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using OmasApi.Controllers.Middleware;
using OmasApi.Data;
using OmasApi.Models;
using OmasApi.Services;

namespace OmasApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly OmasDbContext _db;
        private readonly UserIdentity _identity;
        private readonly UserService _userService;
        private readonly OrderBatchService _orderBatchService;
        private readonly ViewRenderService _viewRenderService;
        private readonly EmailService _emailService;
        private readonly EmailSettings _emailSettings;

        public OrdersController(OmasDbContext db, UserIdentity identity, UserService userService,
            OrderBatchService orderBatchService, ViewRenderService viewRenderService, EmailService emailService,
            IOptions<AppSettings> appSettings)
        {
            _db = db;
            _identity = identity;
            _userService = userService;
            _orderBatchService = orderBatchService;
            _viewRenderService = viewRenderService;
            _emailService = emailService;
            _emailSettings = appSettings.Value.EmailSettings;
        }

        [HttpGet]
        public Task<List<OrderHistoryModel>> GetHistory()
        {
            var userId = GetUserId();

            return _db.OrderBatches
                .Include(b => b.Orders)
                .ThenInclude(o => o.LineItems)
                .Select(b => new OrderHistoryModel
                {
                    BatchId = b.BatchId,
                    DeliveryDate = b.DeliveryDate,
                    Total = b.Orders.SingleOrDefault(o => o.UserId == userId).LineItems.Sum(i => i.Price * i.Quantity)
                })
                .Where(h => h.Total > 0)
                .OrderByDescending(h => h.DeliveryDate)
                .ToListAsync();
        }

        [HttpGet("current")]
        public Order GetCurrentOrder()
        {
            return GetOrder(_orderBatchService.CurrentBatchId);
        }

        [HttpGet("{batchId}")]
        public Order GetOrder([FromRoute] int batchId)
        {
            var userId = GetUserId();

            var order = _db.Orders
                .AsNoTracking()
                .Include(o => o.OrderBatch)
                .Include(o => o.LineItems)
                    .ThenInclude(l => l.CatalogItem)
                .SingleOrDefault(i => i.BatchId == batchId && i.UserId == userId);

            if (order?.LineItems != null)
            {
                order.LineItems = order.LineItems.OrderBy(l => l.CatalogItem.Sequence).ToList();
            }

            return order;
        }

        [HttpPut("confirm")]
        public async Task<Order> ConfirmOrder()
        {
            var userId = GetUserId();
            var batchId = _orderBatchService.CurrentBatchId;

            var order = _db.Orders.SingleOrDefault(i => i.BatchId == batchId && i.UserId == userId);

            if (order != null)
            {
                order.Confirmed = true;
                _db.SaveChanges();

                try
                {
                    await EmailOrder(batchId);
                }
                catch (Exception)
                {
                    // silently continue if emailing fails
                }
            }

            return order;
        }

        [HttpPut]
        public void UpdateCart([FromQuery] int catalogId, [FromQuery] int quantity)
        {
            var userId = GetUserId();
            var batchId = _orderBatchService.CurrentBatchId;

            var catalogItem = _db.CatalogItems.Find(catalogId);

            if (catalogItem == null)
            {
                throw new BadRequestException($"Catalog Item ID '{catalogId}' does not exist");
            }

            var order = GetOrCreateOrder(batchId, userId);
            var orderLine = order.LineItems?.SingleOrDefault(i => i.Sku == catalogItem.Sku);

            // Delete
            if (quantity == 0 && orderLine != null)
            {
                order.LineItems.Remove(orderLine);
            }

            if (quantity > 0)
            {
                if (orderLine == null)
                {
                    // Insert
                    orderLine = new OrderLine
                    {
                        OrderId = order.OrderId,
                        Multiplier = catalogItem.Multiplier,
                        Name = catalogItem.Name,
                        OrderPer = catalogItem.OrderPer,
                        Price = catalogItem.Price,
                        PricePer = catalogItem.PricePer,
                        Quantity = quantity,
                        Sku = catalogItem.Sku,
                        Weight = catalogItem.Weight
                    };

                    if (order.LineItems == null) order.LineItems = new List<OrderLine>();
                    order.LineItems.Add(orderLine);
                }
                else
                {
                    // Update
                    orderLine.Quantity = quantity;
                }
            }

            _db.SaveChanges();
        }

        [HttpPost("{batchId}/clone")]
        public void CloneFromHistory([FromRoute] int batchId)
        {
            var userId = GetUserId();
            var currentBatchId = _orderBatchService.CurrentBatchId;

            var order = GetOrCreateOrder(currentBatchId, userId);
            var linesToClone = _db.OrderLines.Where(l => l.Order.BatchId == batchId && l.Order.UserId == userId);

            foreach (var line in linesToClone)
            {
                var existingLine = order.LineItems.SingleOrDefault(l => l.Sku == line.Sku);

                if (existingLine == null)
                {
                    _db.OrderLines.Add(new OrderLine
                    {
                        OrderId = order.OrderId,
                        Sku = line.Sku,
                        Quantity = line.Quantity,
                        Name = line.CatalogItem.Name,
                        Multiplier = line.CatalogItem.Multiplier,
                        OrderPer = line.CatalogItem.OrderPer,
                        PricePer = line.CatalogItem.PricePer,
                        Price = line.CatalogItem.Price,
                        Weight = line.CatalogItem.Weight
                    });
                }
                else
                {
                    existingLine.Quantity += line.Quantity;
                }
            }

            _db.SaveChanges();
        }

        private async Task EmailOrder(int batchId)
        {
            var userId = GetUserId();

            var order = _db.Orders
                .Include(o => o.User)
                .Include(o => o.LineItems)
                .Include(o => o.OrderBatch)
                .SingleOrDefault(o => o.UserId == userId && o.BatchId == batchId);

            if (order == null)
            {
                throw new NotFoundException($"No order found for User '{userId}' and Batch '{batchId}'");
            }

            var orderHtml = await _viewRenderService.RenderViewToStringAsync("~/Views/OrderHtml.cshtml", order);
            await _emailService.SendEmail(_emailSettings.MailFrom, order.User.Email, _emailSettings.Subject, orderHtml);
        }

        private int GetUserId()
        {
            var user = _userService.GetByCognitoId(_identity.CognitoId);
            return user.ImpersonatingUserId ?? user.UserId;
        }

        private Order GetOrCreateOrder(int batchId, int userId)
        {
            var order = _db.Orders
                .Include(o => o.LineItems)
                .SingleOrDefault(i => i.BatchId == batchId && i.UserId == userId);

            if (order == null)
            {
                order = new Order
                {
                    BatchId = batchId,
                    UserId = userId,
                    Confirmed = false
                };

                _db.Orders.Add(order);
                _db.SaveChanges();
            }

            return order;
        }
    }
}