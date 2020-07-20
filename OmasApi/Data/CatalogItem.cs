using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace OmasApi.Data
{
    [Table("Catalog")]
    public class CatalogItem
    {
        [Key]
        public int CatalogId { get; set; }

        [MaxLength(200)]
        public string Name { get; set; }

        [Column(TypeName = "varchar(10)")]
        [MaxLength(10)]
        [Required]
        public string Sku { get; set; }

        [Column(TypeName = "decimal(9,2)")]
        public decimal Price { get; set; }

        [MaxLength(10)]
        public string PricePer { get; set; }

        [Column(TypeName = "decimal(7,2)")]
        public decimal Weight { get; set; }

        [MaxLength(10)]
        public string OrderPer { get; set; }

        [Column(TypeName = "decimal(5,2)")]
        public decimal Multiplier { get; set; }

        public int Sequence { get; set; }

        public int CategoryId { get; set; }
        public virtual Category Category { get; set; }

        public static CatalogItem MapForUpdate(CatalogItem oldData, CatalogItem newData)
        {
            return new CatalogItem
            {
                CatalogId = oldData.CatalogId,
                Name = newData.Name.NullIfEmpty() ?? oldData.Name,
                Sku = newData.Sku.NullIfEmpty() ?? oldData.Sku,
                Price = newData.Price,
                PricePer = newData.PricePer.NullIfEmpty() ?? oldData.PricePer,
                Weight = newData.Weight,
                OrderPer = newData.OrderPer.NullIfEmpty() ?? newData.PricePer.NullIfEmpty() ?? oldData.OrderPer,
                Multiplier = newData.Multiplier == 0.0M ? 1.0M : newData.Multiplier,
                Sequence = oldData.Sequence,
                CategoryId = oldData.CategoryId
            };
        }
    }
}