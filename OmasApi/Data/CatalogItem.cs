using System.ComponentModel.DataAnnotations;
using Amazon.DynamoDBv2.DataModel;

namespace OmasApi.Data
{
    [DynamoDBTable("Omas_CatalogItems")]
    public class CatalogItem
    {
        [DynamoDBHashKey]
        public string CatalogId { get; set; }

        public string CategoryId { get; set; }

        [MaxLength(200)]
        public string Name { get; set; }

        [MaxLength(10)]
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