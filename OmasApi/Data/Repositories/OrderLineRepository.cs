using System.Collections.Generic;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.DocumentModel;
using OmasApi.Data.Entities;

namespace OmasApi.Data.Repositories
{
    public class OrderLineRepository : DynamoDBRepository<OrderLine>
    {
        private readonly DynamoDBContext _db;

        public OrderLineRepository(IAmazonDynamoDB client) : base(client)
        {
            _db = new DynamoDBContext(client, new DynamoDBContextConfig
            {
                Conversion = DynamoDBEntryConversion.V2
            });
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