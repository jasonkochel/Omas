using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
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
        private readonly OrderBatchRepository _repo;
        private readonly OrderRepository _orderRepo;
        private readonly OrderLineRepository _lineRepo;
        private readonly UserRepository _userRepo;

        private readonly EmailService _emailService;
        private readonly OrderBatchService _orderBatchService;

        public OrderBatchesController(OrderBatchRepository repo, EmailService emailService,
            OrderBatchService orderBatchService, OrderLineRepository lineRepo, OrderRepository orderRepo,
            UserRepository userRepo)
        {
            _repo = repo;
            _emailService = emailService;
            _orderBatchService = orderBatchService;
            _lineRepo = lineRepo;
            _orderRepo = orderRepo;
            _userRepo = userRepo;
        }

        [HttpGet]
        public async Task<List<OrderBatch>> GetAll()
        {
            var batches = await _repo.Scan();
            batches.Sort((a, b) => a.DeliveryDate.CompareTo(b.DeliveryDate) * -1);  // sort descending
            return batches;
        }

        [HttpGet("{batchId}")]
        public async Task<OrderBatchModel> GetOrderBatchSummary(string batchId)
        {
            var batch = await _repo.Get(batchId);

            if (batch == null)
            {
                throw new NotFoundException($"Batch '{batchId}' does not exist");
            }

            var orderLines = await _lineRepo.GetByBatch(batchId);

            var model = new OrderBatchModel
            {
                BatchId = batch.BatchId,
                OrderDate = batch.OrderDate,
                DeliveryDate = batch.DeliveryDate,
                IsOpen = batch.IsOpen,
                CustomerCount = orderLines.Select(i => i.UserId).Distinct().Count(),
                Total = orderLines.Sum(i => i.Price * i.Quantity)
            };

            return model;
        }

        [HttpGet("{batchId}/orders")]
        public async Task<List<Order>> GetAllOrderDetailsForBatch(string batchId)
        {
            var orders = await _orderRepo.GetAllForBatch(batchId);
            var orderLines = await _lineRepo.GetByBatch(batchId);
            var users = await _userRepo.Scan();

            return orders.Where(o => o.Confirmed).Select(order =>
            {
                order.LineItems = orderLines.Where(l => l.UserId == order.UserId).OrderBy(l => l.Sequence).ToList();
                order.User = users.Find(u => u.UserId == order.UserId);
                return order;
            }).ToList();
        }

        [HttpGet("{batchId}/consolidated")]
        [SuppressMessage("ReSharper", "PossibleMultipleEnumeration")]
        public async Task<List<OrderLine>> GetConsolidatedOrder(string batchId)
        {
            var orders = await _orderRepo.GetAllForBatch(batchId);
            var orderLines = await _lineRepo.GetByBatch(batchId);

            var confirmedOrderUsers = orders.Where(o => o.Confirmed).Select(o => o.UserId).ToList();
            
            return orderLines
                .Where(ol => confirmedOrderUsers.Contains(ol.UserId))
                .GroupBy(
                    ol => ol.Sku,
                    (sku, lines) =>
                        new OrderLine
                        {
                            Sku = sku,
                            Name = lines.First().Name,
                            Quantity = lines.Sum(l => l.Quantity),
                            Price = lines.Sum(l => l.Price * l.Quantity * l.Multiplier),
                            Sequence = lines.First().Sequence,
                        })
                .OrderBy(ol => ol.Sequence)
                .ToList();
        }

        [HttpPost]
        public async Task<OrderBatch> Post([FromBody] OrderBatch batch)
        {
            batch.BatchId = Guid.NewGuid().ToString();
            await _repo.Put(batch);

            _orderBatchService.RefreshCurrentBatchCache();

            return batch;
        }

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

        [HttpPost("{batchId}/email")]
        public async Task EmailOrders([FromRoute] string batchId)
        {
            var orders = await _orderRepo.GetAllForBatch(batchId);

            foreach (var order in orders)
            {
                await _emailService.EmailOrderForUser(batchId, order.UserId);
            }
        }
    }
}