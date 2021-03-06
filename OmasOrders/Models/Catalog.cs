//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace OmasOrders.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class Catalog
    {
        public Catalog()
        {
            this.Orders = new HashSet<Order>();
        }
    
        public int CatalogID { get; set; }
        public int BatchID { get; set; }
        public string Name { get; set; }
        public string SKU { get; set; }
        public string OrderPer { get; set; }
        public string PricePer { get; set; }
        public decimal Price { get; set; }
        public decimal Multiplier { get; set; }
        public decimal Weight { get; set; }
        public Nullable<decimal> Sequence { get; set; }
    
        public virtual OrderBatch OrderBatch { get; set; }
        public virtual ICollection<Order> Orders { get; set; }
    }
}
