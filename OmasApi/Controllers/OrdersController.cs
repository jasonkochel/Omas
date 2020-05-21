using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OmasApi.Controllers.Middleware;
using OmasApi.Data;
using OmasApi.Models;

namespace OmasApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly OmasDbContext _db;
        private readonly UserIdentity _identity;

        public OrdersController(OmasDbContext db, UserIdentity identity)
        {
            _db = db;
            _identity = identity;
        }

        [HttpGet]
        public Task<List<OrderHistoryModel>> GetHistory()
        {
            var user = _db.Users.SingleOrDefault(u => u.CognitoId == _identity.CognitoId);

            if (user == null)
            {
                throw new UnauthorizedException("User is not logged in or cannot be found");
            }

            return _db.OrderBatches
                .Include(b => b.OrderItems)
                .Select(b => new OrderHistoryModel
                {
                    BatchId = b.BatchId,
                    DeliveryDate = b.DeliveryDate,
                    Total = b.OrderItems.Where(i => i.UserId == user.UserId).Sum(i => i.Price * i.Quantity)
                })
                .Where(h => h.Total > 0)
                .ToListAsync();
        }

        [HttpGet("{batchId}")]
        public Task<List<Order>> GetOrder([FromRoute] int batchId)
        {
            var user = _db.Users.SingleOrDefault(u => u.CognitoId == _identity.CognitoId);

            if (user == null)
            {
                throw new UnauthorizedException("User is not logged in or cannot be found");
            }

            return _db.OrderItems.Where(i => i.BatchId == batchId && i.UserId == user.UserId).ToListAsync();
        }

        /*
        TODO:
            - Add-to-Cart/Update-Cart-Quantity/Remove-from-Cart
            - Bulk insert into cart from history
            - Get all orders (all users) for a batch
            - Get consolidated order (all users) for a batch
            - Email order confirmation/reminder (one or all users)
        */
    }
}