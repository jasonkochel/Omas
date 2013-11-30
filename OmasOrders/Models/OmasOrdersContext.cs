using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace OmasOrders.Models
{
    public class OmasOrdersContext : DbContext
    {
        // You can add custom code to this file. Changes will not be overwritten.
        // 
        // If you want Entity Framework to drop and regenerate your database
        // automatically whenever you change your model schema, please use data migrations.
        // For more information refer to the documentation:
        // http://msdn.microsoft.com/en-us/data/jj591621.aspx
    
        public OmasOrdersContext() : base("name=OmasOrdersContext")
        {
        }

        public System.Data.Entity.DbSet<OmasOrders.Models.User> Users { get; set; }

        public System.Data.Entity.DbSet<OmasOrders.Models.Order> Orders { get; set; }

        public System.Data.Entity.DbSet<OmasOrders.Models.OrderBatch> OrderBatches { get; set; }

        public System.Data.Entity.DbSet<OmasOrders.Models.CatalogItem> CatalogItems { get; set; }
    
    }
}
