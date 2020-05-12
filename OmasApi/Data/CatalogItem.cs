using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OmasApi.Data
{
    [Table("Catalog")]
    public class CatalogItem
    {
        [Key]
        public int CatalogId { get; set; }

        [MaxLength(200)]
        public string Name { get; set; }

        [MaxLength(10)]
        public string Sku { get; set; }

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

        public int Sequence { get; set; }

        public int CategoryId { get; set; }
        public virtual Category Category { get; set; }
    }
}