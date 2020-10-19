using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
using OmasApi.Controllers.Middleware;
using OmasApi.Data.Entities;
using OmasApi.Data.Repositories;

namespace OmasApi.Services
{
    public class OrderBatchService
    {
        private readonly IMemoryCache _cache;
        private readonly OrderBatchRepository _repo;

        public string CurrentBatchId =>
            _cache.TryGetValue("CurrentBatchId", out string batchId) ? batchId : RefreshCurrentBatchCache().Result;

        public OrderBatchService(IMemoryCache cache, OrderBatchRepository repo)
        {
            _cache = cache;
            _repo = repo;
        }

        public async Task<string> RefreshCurrentBatchCache()
        {
            var batches = _repo.Scan().Result;

            var batchId = batches.SingleOrDefault(ob => ob.IsOpen)?.BatchId ??
                          batches.OrderByDescending(ob => ob.DeliveryDate).FirstOrDefault()?.BatchId;

            if (batchId == null)
            {
                batchId = Guid.NewGuid().ToString();

                // initial "seed" batch if table is empty
                await _repo.Put(new OrderBatch
                {
                    BatchId = batchId,
                    DeliveryDate = DateTime.Today.AddDays(7),
                    OrderDate = DateTime.Today,
                    IsOpen = true
                });
            }

            _cache.Set("CurrentBatchId", batchId);
            return batchId;
        }
    }
}
