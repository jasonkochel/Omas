using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.DocumentModel;
using Amazon.DynamoDBv2.Model;
using Microsoft.Extensions.Options;
using OmasApi.Data.Entities;
using OmasApi.Models;

namespace OmasApi.Data.Repositories
{
    public class CategoryRepository : DynamoDBRepository<Category>
    {
        public CategoryRepository(IAmazonDynamoDB client, RequestContext requestContext,
            IOptions<AppSettings> appSettings) : base(client, requestContext, appSettings)
        {
        }

        public async Task<Category> GetBySequence(int sequence)
        {
            var search = _db.FromQueryAsync<Category>(new QueryOperationConfig
            {
                IndexName = "Omas_Categories_Idx_Sequence",
                Select = SelectValues.AllAttributes,
                Filter = new QueryFilter("Sequence", QueryOperator.Equal,
                    new List<AttributeValue> { new AttributeValue { N = sequence.ToString() } })
            });

            var results = await search.GetRemainingAsync();

            return results.FirstOrDefault();
        }

        public async Task BulkUpdateSequence(int startingAt, int incrementBy)
        {
            var categoriesToUpdate = await Scan(new List<ScanCondition>
            {
                new ScanCondition("Sequence", ScanOperator.GreaterThanOrEqual, startingAt)
            });

            var batch = _db.CreateBatchWrite<Category>();

            foreach (var category in categoriesToUpdate)
            {
                category.Sequence += incrementBy;
                batch.AddPutItem(category);
            }

            await batch.ExecuteAsync();
        }
    }
}