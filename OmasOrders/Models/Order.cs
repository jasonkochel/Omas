using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace OmasOrders.Models
{
    public class Order
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        
        public int OrderBatchId { get; set; }

        [ForeignKey("OrderBatchId")]
        public OrderBatch OrderBatch { get; set; }

        public User User { get; set; }
        public List<OrderItem> OrderItems { get; set; }
    }
}