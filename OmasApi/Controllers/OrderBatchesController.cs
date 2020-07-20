using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using OmasApi.Controllers.Middleware;
using OmasApi.Data;
using OmasApi.Models;
using OmasApi.Services;

namespace OmasApi.Controllers
{
    [AdminOnly]
    [ApiController]
    [Route("[controller]")]
    public class OrderBatchesController : ControllerBase
    {
        private readonly OmasDbContext _db;
        private readonly ViewRenderService _viewRenderService;
        private readonly EmailService _emailService;
        private readonly EmailSettings _emailSettings;

        public OrderBatchesController(OmasDbContext db, ViewRenderService viewRenderService, EmailService emailService, IOptions<AppSettings> appSettings)
        {
            _db = db;
            _viewRenderService = viewRenderService;
            _emailService = emailService;
            _emailSettings = appSettings.Value.EmailSettings;
        }

        [HttpGet]
        public Task<List<OrderBatch>> GetAll()
        {
            return _db.OrderBatches
                .AsNoTracking()
                .OrderByDescending(b => b.DeliveryDate)
                .ToListAsync();
        }


        [HttpGet("{id}")]
        public async Task<OrderBatchModel> Get(int id)
        {
            var batch = await _db.OrderBatches.Include(b => b.Orders).ThenInclude(o => o.LineItems)
                .SingleOrDefaultAsync(b => b.BatchId == id);

            if (batch == null)
            {
                throw new NotFoundException($"Batch '{id}' does not exist");
            }

            var model = new OrderBatchModel
            {
                BatchId = batch.BatchId,
                OrderDate = batch.OrderDate,
                DeliveryDate = batch.DeliveryDate,
                IsOpen = batch.IsOpen,
                CustomerCount = batch.Orders.Select(i => i.UserId).Distinct().Count(),
                Total = batch.Orders.SelectMany(o => o.LineItems).Sum(li => li.Price * li.Quantity)
            };

            return model;
        }

        [HttpGet("{id}/orders")]
        public async Task<List<Order>> GetOrders(int id)
        {
            var orders = await _db.Orders
                .Include(o => o.LineItems)
                .ThenInclude(l => l.CatalogItem)
                .Include(o => o.User)
                .Where(o => o.BatchId == id && o.Confirmed)
                .ToListAsync();

            return orders.Select(order =>
            {
                order.LineItems = order.LineItems.OrderBy(l => l.CatalogItem.Sequence).ToList();
                return order;
            }).ToList();
        }

        [HttpGet("{id}/consolidated")]
        [SuppressMessage("ReSharper", "PossibleMultipleEnumeration")]
        public List<OrderLine> GetConsolidatedOrder(int id)
        {
            return _db.OrderLines
                .Include(ol => ol.CatalogItem)
                .Where(ol => ol.Order.BatchId == id && ol.Order.Confirmed)
                .AsEnumerable()
                .GroupBy(
                    ol => ol.Sku,
                    (sku, lines) =>
                        new OrderLine
                        {
                            // Stealing this property to use as sorting key
                            LineId = lines.First().CatalogItem.Sequence,
                            Sku = sku,
                            Name = lines.First().Name,
                            Quantity = lines.Sum(l => l.Quantity),
                            Price = lines.Sum(l => l.Price * l.Quantity * l.Multiplier)
                        })
                .OrderBy(ol => ol.LineId)
                .ToList();
        }

        [HttpPost]
        public async Task<OrderBatch> Post([FromBody] OrderBatch batch)
        {
            _db.OrderBatches.Add(batch);
            await _db.SaveChangesAsync();

            return batch;
        }

        [HttpPut("{id}")]
        public async Task<OrderBatch> Put(int id, [FromBody] OrderBatch batch)
        {
            if (!_db.OrderBatches.Any(b => b.BatchId == id))
            {
                throw new NotFoundException($"Batch '{id}' does not exist");
            }

            if (id != batch.BatchId)
            {
                throw new BadRequestException("Route BatchID does not match request body");
            }

            _db.OrderBatches.Update(batch);
            await _db.SaveChangesAsync();

            return batch;
        }

        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            if (_db.Orders.Any(i => i.BatchId == id))
            {
                throw new ReferentialIntegrityException($"Batch '{id}' contains orders and cannot be deleted");
            }

            var batch = await _db.OrderBatches.FindAsync(id);

            if (batch == null)
            {
                throw new NotFoundException($"Batch '{id}' does not exist");
            }

            _db.OrderBatches.Remove(batch);
            await _db.SaveChangesAsync();
        }

        [HttpPost("{id}/email")]
        public async Task EmailOrders([FromRoute] int id)
        {
            var orders = _db.Orders
                .Include(o => o.User)
                .Include(o => o.LineItems)
                .Include(o => o.OrderBatch)
                .Where(o => o.BatchId == id);

            foreach (var order in orders)
            {
                var orderHtml = await _viewRenderService.RenderViewToStringAsync("~/Views/OrderHtml.cshtml", order);
                await _emailService.SendEmail(_emailSettings.MailFrom, order.User.Email, _emailSettings.Subject, orderHtml);
            }
        }
    }
}