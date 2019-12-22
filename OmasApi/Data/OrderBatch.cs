using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OmasApi.Data
{
    [Table("OrderBatches")]
    public class OrderBatch
    {
        [Key]
        public int BatchId { get; set; }

        public DateTime? OrderDate { get; set; }
        public DateTime? DeliveryDate { get; set; }
    
        public virtual ICollection<CatalogItem> CatalogItems { get; set; }
        public virtual ICollection<Order> OrderItems { get; set; }
    }
}
