using Amazon.DynamoDBv2.DataModel;

namespace OmasApi.Data
{
    public class OrderBatchRepository : DynamoDBRepository<OrderBatch>
    {
        public OrderBatchRepository(DynamoDBContext db) : base(db) { }
    }
}