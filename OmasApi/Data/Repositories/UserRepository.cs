using Amazon.DynamoDBv2;
using OmasApi.Data.Entities;

namespace OmasApi.Data.Repositories
{
    public class UserRepository : DynamoDBRepository<User>
    {
        public UserRepository(IAmazonDynamoDB client) : base(client) { }
    }
}