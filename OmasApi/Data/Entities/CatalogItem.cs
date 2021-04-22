using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Amazon.DynamoDBv2.DataModel;

namespace OmasApi.Data.Entities
{
    [DynamoDBTable("Omas_CatalogItems")]
    public class CatalogItem
    {
        [DynamoDBHashKey]
        public string CatalogId { get; set; }

        public string CategoryId { get; set; }

        [MaxLength(200)]
        public string Name { get; set; }

        public string Description { get; set; }

        [MaxLength(20)]
        [Required]
        public string Sku { get; set; }

        public decimal Price { get; set; }
        public decimal Weight { get; set; }
        public decimal Multiplier { get; set; }
        public int Sequence { get; set; }

        [MaxLength(10)]
        public string PricePer { get; set; }

        [MaxLength(10)]
        public string OrderPer { get; set; }

        public bool New { get; set; }
        public bool Featured { get; set; }
        public bool Discontinued { get; set; }

        public List<CatalogItem> Import(IEnumerable<string> lines)
        {
            return lines
                .Select(line => line.Split('\t'))
                .Where(fields => fields.Length == 14)
                .Select(fields => new CatalogItem
                {
                    CatalogId = fields[0],
                    Name = fields[1],
                    Sku = fields[2],
                    OrderPer = fields[3],
                    PricePer = fields[4],
                    Price = decimal.Parse(fields[5]),
                    Multiplier = decimal.Parse(fields[6]),
                    Weight = decimal.Parse(fields[7]),
                    Sequence = int.Parse(fields[8]),
                    CategoryId = fields[9],
                    New = bool.Parse(fields[10]),
                    Featured = bool.Parse(fields[11]),
                    Discontinued = bool.Parse(fields[12]),
                    Description = fields[13],
                }).ToList();
        }
    }
}