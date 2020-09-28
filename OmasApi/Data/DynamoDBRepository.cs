using System.Collections.Generic;
using System.Threading.Tasks;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.DocumentModel;
using Amazon.DynamoDBv2.Model;

namespace OmasApi.Data
{
    public class DynamoDBRepository<T>
    {
        private readonly DynamoDBContext _db;

        public DynamoDBRepository(DynamoDBContext db)
        {
            _db = db;
        }

        public async Task<List<T>> Scan(List<ScanCondition> conditions = null)
        {
            if (conditions == null)
            {
                conditions = new List<ScanCondition>();
            }

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