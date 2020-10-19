using System.Collections.Generic;
using System.Linq;
using Amazon.DynamoDBv2.DataModel;

namespace OmasApi.Data.Entities
{
    [DynamoDBTable("Omas_Users")]
    public class User
    {
        /// <summary>
        /// GUID issued by Cognito
        /// </summary>
        [DynamoDBHashKey]
        public string UserId { get; set; }

        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }

        public List<User> Import(IEnumerable<string> lines)
        {
            return lines
                .Select(line => line.Split('\t'))
                .Where(fields => fields.Length == 5)
                .Select(fields => new User
                {
                    UserId = fields[1].ToLower(),
                    Name = fields[2],
                    Email = fields[3],
                    Phone = fields[4]
                }).ToList();
        }

    }
}
