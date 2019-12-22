using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OmasApi.Data
{
    public class Order
    {
        [Key]
        public int OrderId { get; set; }

        public int BatchId { get; set; }
        public virtual OrderBatch OrderBatch { get; set; }

        public int UserId { get; set; }
        public virtual User User { get; set; }

        public int CatalogId { get; set; }
        public virtual CatalogItem CatalogItem { get; set; }

        [Column(TypeName = "decimal(7,2)")]
        public decimal Quantity { get; set; }
        public DateTime AddDate { get; set; }
    }
}
