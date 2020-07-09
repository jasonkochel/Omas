using System.Linq;
using Microsoft.Extensions.Caching.Memory;
using OmasApi.Controllers.Middleware;
using OmasApi.Data;

namespace OmasApi.Services
{
    public class OrderBatchService
    {
        private readonly IMemoryCache _cache;
        private readonly OmasDbContext _db;

        public int CurrentBatchId =>
            _cache.TryGetValue("CurrentBatchId", out int batchId) ? batchId : RefreshCurrentBatchCache();

        public OrderBatchService(IMemoryCache cache, OmasDbContext db)
        {
            _cache = cache;
            _db = db;
        }

        public int RefreshCurrentBatchCache()
        {
            var batchId = _db.OrderBatches.SingleOrDefault(ob => ob.IsOpen)?.BatchId ??
                          _db.OrderBatches.OrderByDescending(ob => ob.DeliveryDate).FirstOrDefault()?.BatchId;

            if (batchId == null)
            {
                throw new InternalException("Current Order Batch ID could not be determined");
            }

            _cache.Set("CurrentBatchId", batchId.Value);
            return batchId.Value;
        }
    }
}
