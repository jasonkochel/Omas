using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Amazon.DynamoDBv2.DataModel;

namespace OmasApi.Data.Entities
{
    [DynamoDBTable("Omas_Categories")]
    public class Category
    {
        [DynamoDBHashKey]
        public string CategoryId { get; set; }

        [MaxLength(200)]
        public string Name { get; set; }

        [MaxLength(1000)]
        public string Description { get; set; }

        [DynamoDBGlobalSecondaryIndexHashKey("Sequence")]
        public int Sequence { get; set; }

        [DynamoDBIgnore]
        public List<CatalogItem> CatalogItems { get; set; }

        public List<Category> Import(IEnumerable<string> lines)
        {
            return lines
                .Select(line => line.Split('\t'))
                .Where(fields => fields.Length == 4)
                .Select(fields => new Category
                {
                    CategoryId = fields[0],
                    Name = fields[1],
                    Description = fields[2],
                    Sequence = int.Parse(fields[3])
                }).ToList();
        }
    }
}