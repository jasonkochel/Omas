using Amazon.DynamoDBv2;
using Microsoft.Extensions.Options;
using OmasApi.Data.Entities;
using OmasApi.Models;

namespace OmasApi.Data.Repositories
{
    public class UserRepository : DynamoDBRepository<User>
    {
        public UserRepository(IAmazonDynamoDB client, RequestContext requestContext,
            IOptions<AppSettings> appSettings) : base(client, requestContext, appSettings)
        {
        }
    }
}