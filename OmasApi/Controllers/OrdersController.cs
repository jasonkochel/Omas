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
                .Include(b => b.OrderItems)
                .Select(b => new OrderHistoryModel
                {
                    BatchId = b.BatchId,
                    DeliveryDate = b.DeliveryDate,
                    Total = b.OrderItems.Where(i => i.UserId == userId).Sum(i => i.Price * i.Quantity)
                })
                .Where(h => h.Total > 0)
                .ToListAsync();
        }

        [HttpGet("{batchId}")]
        public Task<List<Order>> GetOrder([FromRoute] int batchId)
        {
            var userId = _userService.GetByCognitoId(_identity.CognitoId);

            return _db.OrderItems.Where(i => i.BatchId == batchId && i.UserId == userId).ToListAsync();
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

            var order = _db.OrderItems.SingleOrDefault(i =>
                i.BatchId == batchId && i.UserId == userId && i.Sku == catalogItem.Sku);

            // Delete
            if (quantity == 0 && order != null)
            {
                _db.OrderItems.Remove(order);
            }

            if (quantity > 0)
            {
                if (order == null)
                {
                    // Insert
                    _db.OrderItems.Add(new Order
                    {
                        BatchId = batchId,
                        Multiplier = catalogItem.Multiplier,
                        Name = catalogItem.Name,
                        OrderPer = catalogItem.OrderPer,
                        Price = catalogItem.Price,
                        PricePer = catalogItem.PricePer,
                        Quantity = quantity,
                        Sku = catalogItem.Sku,
                        UserId = userId,
                        Weight = catalogItem.Weight
                    });
                }
                else
                {
                    // Update
                    order.Quantity = quantity;
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