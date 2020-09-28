using Amazon.DynamoDBv2.DataModel;

namespace OmasApi.Data
{
    [DynamoDBTable("Omas_Users")]
    public class User
    {
        [DynamoDBHashKey]
        public string UserId { get; set; }

        //public Guid CognitoId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
    }
}
