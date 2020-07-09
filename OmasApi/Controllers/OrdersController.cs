using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        public OrdersController(OmasDbContext db, UserIdentity identity, UserService userService, OrderBatchService orderBatchService)
        {
            _db = db;
            _identity = identity;
            _userService = userService;
            _orderBatchService = orderBatchService;
        }

        [HttpGet]
        public Task<List<OrderHistoryModel>> GetHistory()
        {
            var userId = _userService.GetByCognitoId(_identity.CognitoId);

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
            var userId = _userService.GetByCognitoId(_identity.CognitoId);

            return _db.Orders
                .Include(o => o.OrderBatch)
                .Include(o => o.LineItems)
                .SingleOrDefault(i => i.BatchId == batchId && i.UserId == userId);
        }

        [HttpPut("confirm")]
        public Order ConfirmOrder()
        {
            var userId = _userService.GetByCognitoId(_identity.CognitoId);
            var batchId = _orderBatchService.CurrentBatchId;

            var order = _db.Orders.SingleOrDefault(i => i.BatchId == batchId && i.UserId == userId);

            if (order != null)
            {
                order.Confirmed = true;
                _db.SaveChanges();
            }

            return order;
        }

        [HttpPut]
        public void UpdateCart([FromQuery] int catalogId, [FromQuery] int quantity)
        {
            var userId = _userService.GetByCognitoId(_identity.CognitoId);
            var batchId = _orderBatchService.CurrentBatchId;

            var catalogItem = _db.CatalogItems.Find(catalogId);

            if (catalogItem == null)
            {
                throw new BadRequestException($"Catalog Item ID '{catalogId}' does not exist");
            }

            var order = _db.Orders.Include(o => o.LineItems)
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
            }

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

        /*
        TODO:
            - Bulk insert into cart from history
            - Get all orders (all users) for a batch
            - Get consolidated order (all users) for a batch
            - Email order confirmation/reminder (one or all users)
        */
    }
}