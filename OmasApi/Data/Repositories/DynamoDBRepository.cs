using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.DocumentModel;
using Amazon.DynamoDBv2.Model;
using Microsoft.Extensions.Options;
using OmasApi.Models;

namespace OmasApi.Data.Repositories
{
    public class DynamoDBRepository<T>
    {
        // ReSharper disable once InconsistentNaming
        protected readonly DynamoDBContext _db;

        public DynamoDBRepository(IAmazonDynamoDB client, RequestContext requestContext, IOptions<AppSettings> appSettings)
        {
            _db = new DynamoDBContext(client, new DynamoDBContextConfig
            {
                Conversion = DynamoDBEntryConversion.V2,
                ConsistentRead = true,
                TableNamePrefix = appSettings.Value.Sites.FirstOrDefault(s => s.HostHeader == requestContext.HostHeader)?.TablePrefix ?? ""
            });
        }

        public async Task<List<T>> Scan(List<ScanCondition> conditions = null)
        {
            conditions ??= new List<ScanCondition>();

            return await _db.ScanAsync<T>(conditions).GetRemainingAsync();
        }

        public async Task<T> Get(string id)
        {
            return await _db.LoadAsync<T>(id);
        }

        public async Task Put(T item)
        {
            await _db.SaveAsync(item);
        }

        public async Task Delete(string id)
        {
            await _db.DeleteAsync<T>(id);
        }

        public async Task Delete(T item)
        {
            await _db.DeleteAsync(item);
        }

        protected async Task<List<T>> QueryByIndex(string indexName, string fieldName, string queryValue)
        {
            var search = _db.FromQueryAsync<T>(new QueryOperationConfig
            {
                IndexName = indexName,
                Select = SelectValues.AllAttributes,
                Filter = new QueryFilter(fieldName, QueryOperator.Equal,
                    new List<AttributeValue> { new AttributeValue { S = queryValue } })
            });

            return await search.GetRemainingAsync();
        }
    }
}