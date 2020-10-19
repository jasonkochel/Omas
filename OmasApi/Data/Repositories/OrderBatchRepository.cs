using Amazon.DynamoDBv2;
using OmasApi.Data.Entities;

namespace OmasApi.Data.Repositories
{
    public class OrderBatchRepository : DynamoDBRepository<OrderBatch>
    {
        public OrderBatchRepository(IAmazonDynamoDB client) : base(client) { }
    }
}