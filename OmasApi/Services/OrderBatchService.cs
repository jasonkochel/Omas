using System.Linq;
using Microsoft.Extensions.Caching.Memory;
using OmasApi.Controllers.Middleware;
using OmasApi.Data;

namespace OmasApi.Services
{
    public class OrderBatchService
    {
        private readonly IMemoryCache _cache;
        private readonly OrderBatchRepository _repo;

        public string CurrentBatchId =>
            _cache.TryGetValue("CurrentBatchId", out string batchId) ? batchId : RefreshCurrentBatchCache();

        public OrderBatchService(IMemoryCache cache, OrderBatchRepository repo)
        {
            _cache = cache;
            _repo = repo;
        }

        public string RefreshCurrentBatchCache()
        {
            var batches = _repo.Scan().Result;

            var batchId = batches.SingleOrDefault(ob => ob.IsOpen)?.BatchId ??
                          batches.OrderByDescending(ob => ob.DeliveryDate).FirstOrDefault()?.BatchId;

            if (batchId == null)
            {
                throw new InternalException("Current Order Batch ID could not be determined");
            }

            _cache.Set("CurrentBatchId", batchId);
            return batchId;
        }
    }
}
