using Amazon.DynamoDBv2.DataModel;

namespace OmasApi.Data
{
    public class UserRepository : DynamoDBRepository<User>
    {
        public UserRepository(DynamoDBContext db) : base(db) { }
    }
}