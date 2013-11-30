using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Security.AccessControl;
using System.Text;

namespace OmasOrders.Models
{
    public class CatalogItem
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public string Name { get; set; }
        public string Sku { get; set; }
        public string OrderPer { get; set; }
        public string PricePer { get; set; }
        public decimal Price { get; set; }
        public decimal Multiplier { get; set; }
        public decimal Weight { get; set; }
        public int Sequence { get; set; }
    }
}
