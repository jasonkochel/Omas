using System.ComponentModel.DataAnnotations;
using Amazon.DynamoDBv2.DataModel;

namespace OmasApi.Data
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
    }
}