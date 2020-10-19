using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.DocumentModel;
using OmasApi.Data.Entities;

namespace OmasApi.Data.Repositories
{
    public class CatalogItemRepository : DynamoDBRepository<CatalogItem>
    {
        private readonly DynamoDBContext _db;

        public CatalogItemRepository(IAmazonDynamoDB client) : base(client)
        {
            _db = new DynamoDBContext(client, new DynamoDBContextConfig
            {
                Conversion = DynamoDBEntryConversion.V2
            });
        }

        public async Task<List<CatalogItem>> GetByCategory(string categoryId)
        {
            return await QueryByIndex("Omas_CatalogItems_Idx_Category", "CategoryId", categoryId);
        }

        public async Task<CatalogItem> GetBySequence(int sequence)
        {
            var results = await QueryByIndex("Omas_CatalogItems_Idx_Sequence", "Sequence", sequence.ToString());
            return results.FirstOrDefault();
        }

        public async Task<CatalogItem> GetBySku(string sku)
        {
            var results = await QueryByIndex("Omas_CatalogItems_Idx_Sku", "Sku", sku);
            return results.FirstOrDefault();
        }

        public async Task BulkUpdateSequence(string categoryId, int startingAt, int incrementBy)
        {
            var itemsToUpdate = await Scan(new List<ScanCondition>
            {
                new ScanCondition("CategoryId", ScanOperator.Equal, categoryId),
                new ScanCondition("Sequence", ScanOperator.GreaterThanOrEqual, startingAt)
            });

            var batch = _db.CreateBatchWrite<CatalogItem>();

            foreach (var item in itemsToUpdate)
            {
                item.Sequence += incrementBy;
                batch.AddPutItem(item);
            }

            await batch.ExecuteAsync();
        }
    }
}