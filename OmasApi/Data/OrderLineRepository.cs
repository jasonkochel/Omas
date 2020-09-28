using System.Collections.Generic;
using System.Threading.Tasks;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.DocumentModel;

namespace OmasApi.Data
{
    public class OrderLineRepository : DynamoDBRepository<OrderLine>
    {
        private readonly DynamoDBContext _db;

        public OrderLineRepository(DynamoDBContext db) : base(db)
        {
            _db = db;
        }

        public async Task<OrderLine> Get(string batchId, string userId, string sku)
        {
            return await _db.LoadAsync<OrderLine>(batchId, $"{userId}#{sku}");
        }

        public async Task<List<OrderLine>> GetByOrder(string batchId, string userId)
        {
            return await _db.QueryAsync<OrderLine>(batchId, QueryOperator.BeginsWith, new[] { userId })
                .GetRemainingAsync();
        }

        public async Task<List<OrderLine>> GetByBatch(string batchId)
        {
            return await _db.QueryAsync<OrderLine>(batchId).GetRemainingAsync();
        }
    }
}