using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Amazon.DynamoDBv2.DataModel;

namespace OmasApi.Data
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
    }
}