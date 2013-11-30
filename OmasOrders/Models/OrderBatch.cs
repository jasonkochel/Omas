using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;

namespace OmasOrders.Models
{
    public class OrderBatch
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public DateTime OrderBy { get; set; }
        public DateTime DeliverOn { get; set; }

        public List<CatalogItem> Catalog;
        public List<Order> Orders;
    }
}
