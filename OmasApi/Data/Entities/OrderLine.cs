using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Amazon.DynamoDBv2.DataModel;

namespace OmasApi.Data.Entities
{
    [DynamoDBTable("Omas_OrderLines")]
    public class OrderLine
    {
        [DynamoDBHashKey]
        public string BatchId { get; set; }

        [DynamoDBRangeKey]
        // ReSharper disable once InconsistentNaming
        public string UserId_Sku { get; set; }

        public string UserId { get; set; }

        [MaxLength(200)]
        public string Name { get; set; }

        [MaxLength(10)]
        [Required]
        public string Sku { get; set; }

        public decimal Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal Multiplier { get; set; }
        public decimal Weight { get; set; }
        public int Sequence { get; set; }

        [MaxLength(10)]
        public string OrderPer { get; set; }

        [MaxLength(10)]
        public string PricePer { get; set; }

        public List<OrderLine> Import(IEnumerable<string> lines)
        {
            /*
            select o.BatchID, u.CognitoID, ol.*, c.Sequence
            from orderlines ol
            join orders o on ol.OrderID = o.OrderID
            join users u on o.userid=u.userid
            join catalog c on ol.sku = c.sku
            */

            return lines
                .Select(line => line.Split('\t'))
                .Where(fields => fields.Length == 13)
                .Select(fields => new OrderLine
                {
                    BatchId = fields[0],
                    UserId = fields[1].ToLower(),
                    UserId_Sku = fields[1].ToLower() + "#" + fields[5],
                    Name = fields[4],
                    Sku = fields[5],
                    Quantity = decimal.Parse(fields[6]),
                    OrderPer = fields[7],
                    PricePer = fields[8],
                    Price = decimal.Parse(fields[9]),
                    Multiplier = decimal.Parse(fields[10]),
                    Weight = decimal.Parse(fields[11]),
                    Sequence = int.Parse(fields[12]),
                }).ToList();
        }
    }
}