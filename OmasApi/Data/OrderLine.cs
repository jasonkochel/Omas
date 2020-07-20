using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OmasApi.Data
{
    [Table("OrderLines")]
    public class OrderLine
    {
        [Key]
        public int LineId { get; set; }

        public int OrderId { get; set; }
        public virtual Order Order { get; set; }

        [MaxLength(200)]
        public string Name { get; set; }

        [Column(TypeName = "varchar(10)")]
        [MaxLength(10)]
        [Required]
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

        public virtual CatalogItem CatalogItem { get; set; }
    }
}