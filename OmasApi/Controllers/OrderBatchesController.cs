using System;
using System.Collections.Generic;
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
    public class OrderBatchesController : ControllerBase
    {
        private readonly OrderBatchRepository _repo;
        private readonly OrderRepository _orderRepo;
        private readonly OrderLineRepository _lineRepo;
        private readonly UserRepository _userRepo;
        private readonly SettingsRepository _settingsRepo;

        private readonly EmailService _emailService;
        private readonly OrderBatchService _orderBatchService;

        public OrderBatchesController(OrderBatchRepository repo, EmailService emailService,
            OrderBatchService orderBatchService, OrderLineRepository lineRepo, OrderRepository orderRepo,
            UserRepository userRepo, SettingsRepository settingsRepo)
        {
            _repo = repo;
            _emailService = emailService;
            _orderBatchService = orderBatchService;
            _lineRepo = lineRepo;
            _orderRepo = orderRepo;
            _userRepo = userRepo;
            _settingsRepo = settingsRepo;
        }

        [AdminOnly]
        [HttpGet]
        public async Task<List<OrderBatch>> GetAll()
        {
            var batches = await _repo.Scan();

            if (!batches.Any())
            {
                var seedBatch = await Post(new OrderBatch
                {
                    OrderDate = DateTime.Today,
                    DeliveryDate = DateTime.Today.AddDays(7),
                    IsOpen = true
                });

                batches.Add(seedBatch);
            }

            batches.Sort((a, b) => a.DeliveryDate.CompareTo(b.DeliveryDate) * -1);  // sort descending
            return batches;
        }

        [HttpGet("current")]
        public string GetCurrentBatch()
        {
            return _orderBatchService.CurrentBatchId;
        }

        [AdminOnly]
        [HttpGet("{batchId}")]
        public async Task<OrderBatchModel> GetOrderBatchSummary(string batchId)
        {
            var batch = await _repo.Get(batchId);

            if (batch == null)
            {
                throw new NotFoundException($"Batch '{batchId}' does not exist");
            }

            var orders = await GetAllOrderDetailsForBatch(batchId, OrderMode.All);

            var model = new OrderBatchModel
            {
                BatchId = batch.BatchId,
                OrderDate = batch.OrderDate,
                DeliveryDate = batch.DeliveryDate,
                IsOpen = batch.IsOpen,
                TaxRate = batch.TaxRate,
                ShippingRate = batch.ShippingRate,
                CustomerCount = orders.Where(o => o.Confirmed).Select(o => o.UserId).Distinct().Count(),
                Total = orders.Where(o => o.Confirmed).Sum(o => o.SubTotal),
                UnconfirmedCustomerCount = orders.Where(o => !o.Confirmed).Select(o => o.UserId).Distinct().Count(),
                UnconfirmedTotal = orders.Where(o => !o.Confirmed).Sum(o => o.SubTotal),
            };

            return model;
        }

        [AdminOnly]
        [HttpGet("{batchId}/orders")]
        public async Task<List<Order>> GetConfirmedOrderDetailsForBatch(string batchId)
        {
            return await GetAllOrderDetailsForBatch(batchId, OrderMode.Confirmed);
        }

        [AdminOnly]
        [HttpGet("{batchId}/unconfirmedOrders")]
        public async Task<List<Order>> GetUnconfirmedOrderDetailsForBatch(string batchId)
        {
            return await GetAllOrderDetailsForBatch(batchId, OrderMode.Unconfirmed);
        }

        [AdminOnly]
        [HttpGet("{batchId}/consolidated")]
        public async Task<List<OrderLine>> GetConsolidatedOrder(string batchId)
        {
            var newOrders = await GetAllOrderDetailsForBatch(batchId, OrderMode.Confirmed);
            var newOrderLines = newOrders.SelectMany(o => o.LineItems);

            return newOrderLines
                .GroupBy(
                    ol => ol.Sku,
                    (sku, lines) =>
                    {
                        var orderLines = lines.ToList();
                        return new OrderLine
                        {
                            Sku = sku,
                            Name = orderLines.First().Name,
                            Quantity = orderLines.Sum(l => l.Quantity),
                            Price = orderLines.Sum(l => l.Price * l.Quantity * l.Multiplier),
                            Sequence = orderLines.First().Sequence,
                        };
                    })
                .OrderBy(ol => ol.Sequence)
                .ToList();
        }

        private async Task<List<Order>> GetAllOrderDetailsForBatch(string batchId, OrderMode mode)
        {
            var orders = await _orderRepo.GetAllForBatch(batchId);
            var orderLines = await _lineRepo.GetByBatch(batchId);
            var users = await _userRepo.Scan();

            return orders.Where(o => mode == OrderMode.All || o.Confirmed == (mode == OrderMode.Confirmed)).Select(
                order =>
                {
                    order.LineItems = orderLines.Where(l => l.UserId == order.UserId).OrderBy(l => l.Sequence).ToList();
                    order.User = users.Find(u => u.UserId == order.UserId);
                    return order;
                }).ToList();
        }

        [AdminOnly]
        [HttpPost]
        public async Task<OrderBatch> Post([FromBody] OrderBatch batch)
        {
            var settings = await _settingsRepo.Get(_settingsRepo.SettingsId);

            batch.BatchId = Guid.NewGuid().ToString();
            batch.TaxRate = settings.TaxRate;
            batch.ShippingRate = settings.ShippingRate;

            await _repo.Put(batch);

            await _orderBatchService.RefreshCurrentBatchCache();

            return batch;
        }

        [AdminOnly]
        [HttpPut("{batchId}")]
        public async Task<OrderBatch> Put(string batchId, [FromBody] OrderBatch batch)
        {
            if (batchId != batch.BatchId)
            {
                throw new BadRequestException("Route BatchID does not match request body");
            }

            await _repo.Put(batch);

            return batch;
        }

        [AdminOnly]
        [HttpDelete("{batchId}")]
        public async Task Delete(string batchId)
        {
            if ((await _orderRepo.GetAllForBatch(batchId)).Any())
            {
                throw new ReferentialIntegrityException($"Batch '{batchId}' contains orders and cannot be deleted");
            }

            var batch = await _repo.Get(batchId);

            if (batch == null)
            {
                throw new NotFoundException($"Batch '{batchId}' does not exist");
            }

            await _repo.Delete(batchId);
        }

        [AdminOnly]
        [HttpPost("{batchId}/email")]
        public async Task EmailOrders([FromRoute] string batchId)
        {
            var orders = await _orderRepo.GetAllForBatch(batchId);

            foreach (var order in orders)
            {
                await _emailService.EmailOrderForUser(batchId, order.UserId);
            }
        }

        private enum OrderMode
        {
            All,
            Confirmed,
            Unconfirmed
        }
    }
}