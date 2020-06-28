using System.Linq;
using Microsoft.Extensions.Options;
using OmasApi.Controllers.Middleware;
using OmasApi.Data;

namespace OmasApi.Services
{
    public class OrderBatchService
    {
        private readonly string _connectionString;
        public int CurrentBatchId { get; private set; }

        public OrderBatchService(IOptions<AppSettings> config)
        {
            _connectionString = config.Value.ConnectionStrings.Default;
            RefreshCurrentBatchCache();
        }

        public void RefreshCurrentBatchCache()
        {
            var db = new OmasDbContext(_connectionString);

            var batchId = db.OrderBatches.SingleOrDefault(ob => ob.IsOpen)?.BatchId ??
                          db.OrderBatches.OrderByDescending(ob => ob.DeliveryDate).FirstOrDefault()?.BatchId;

            if (batchId == null)
            {
                throw new InternalException("Current Order Batch ID could not be determined");
            }

            CurrentBatchId = batchId.Value;
        }
    }
}
