using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OmasApi.Data
{
    [Table("Orders")]
    public class Order
    {
        [Key]
        public int OrderId { get; set; }

        public int BatchId { get; set; }
        public virtual OrderBatch OrderBatch { get; set; }

        public int UserId { get; set; }
        public virtual User User { get; set; }

        [MaxLength(200)]
        public string Name { get; set; }

        [MaxLength(10)]
        public string Sku { get; set; }

        [Column(TypeName = "decimal(7,2)")]
        public decimal Quantity { get; set; }

        [MaxLength(10)]
        public string OrderPer { get; set; }

        [MaxLength(10)]
        public string PricePer { get; set; }

        [Column(TypeName = "decimal(9,2)")]
        public decimal Price { get; set; }

        [Column(TypeName = "decimal(5,2)")]
        public decimal Multiplier { get; set; }

        [Column(TypeName = "decimal(7,2)")]
        public decimal Weight { get; set; }
    }
}
