using System.Collections.Generic;
using System.Threading.Tasks;
using Amazon.DynamoDBv2.DataModel;

namespace OmasApi.Data
{
    public class OrderRepository : DynamoDBRepository<Order>
    {
        private readonly DynamoDBContext _db;

        public OrderRepository(DynamoDBContext db) : base(db)
        {
            _db = db;
        }

        public async Task<Order> Get(string batchId, string userId)
        {
            return await _db.LoadAsync<Order>(batchId, userId);
        }

        public async Task<List<Order>> GetAllForBatch(string batchId)
        {
            return await _db.QueryAsync<Order>(batchId).GetRemainingAsync();
        }

        public async Task<List<Order>> GetAllForUser(string userId)
        {
            return await QueryByIndex("Omas_Orders_Idx_UserId", "UserId", userId);
        }
    }
}