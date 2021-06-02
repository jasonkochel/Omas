using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DocumentModel;
using Microsoft.Extensions.Options;
using OmasApi.Data.Entities;
using OmasApi.Models;

namespace OmasApi.Data.Repositories
{
    public class OrderLineRepository : DynamoDBRepository<OrderLine>
    {
        public OrderLineRepository(IAmazonDynamoDB client, RequestContext requestContext,
            IOptions<AppSettings> appSettings) : base(client, requestContext, appSettings)
        {
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

        public async Task PutMany(List<OrderLine> lines)
        {
            var batch = _db.CreateBatchWrite<OrderLine>();
            batch.AddPutItems(lines);
            await batch.ExecuteAsync();
        }

        public async Task DeleteByOrder(string batchId, string userId)
        {
            var itemsToDelete = await GetByOrder(batchId, userId);

            if (itemsToDelete.Any())
            {
                var batch = _db.CreateBatchWrite<OrderLine>();
                batch.AddDeleteItems(itemsToDelete);
                await batch.ExecuteAsync();
            }
        }
    }
}