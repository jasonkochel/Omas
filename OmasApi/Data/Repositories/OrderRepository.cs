using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using OmasApi.Data.Entities;

namespace OmasApi.Data.Repositories
{
    public class OrderRepository : DynamoDBRepository<Order>
    {
        private readonly DynamoDBContext _db;
        private readonly OrderBatchRepository _batchRepo;
        private readonly OrderLineRepository _lineRepo;
        private readonly UserRepository _userRepo;

        public OrderRepository(IAmazonDynamoDB client, OrderBatchRepository batchRepo, OrderLineRepository lineRepo, UserRepository userRepo) : base(client)
        {
            _batchRepo = batchRepo;
            _lineRepo = lineRepo;
            _userRepo = userRepo;
            _db = new DynamoDBContext(client, new DynamoDBContextConfig
            {
                Conversion = DynamoDBEntryConversion.V2
            });
        }

        public async Task<Order> Get(string batchId, string userId, bool includeNavigationProperties, bool includeLineItems = false)
        {
            var order = await _db.LoadAsync<Order>(batchId, userId);

            if (includeNavigationProperties)
            {
                order.OrderBatch = await _batchRepo.Get(batchId);
                order.User = await _userRepo.Get(userId);
            }

            if (includeLineItems)
            {
                order.LineItems = (await _lineRepo.GetByOrder(batchId, userId))?.OrderBy(l => l.Sequence).ToList();
            }

            return order;
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