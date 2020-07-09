using System.Collections.Generic;
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

        public bool Confirmed { get; set; }

        public virtual ICollection<OrderLine> LineItems { get; set; }
    }
}
