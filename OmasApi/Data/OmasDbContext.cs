using Microsoft.EntityFrameworkCore;

namespace OmasApi.Data
{
    public class OmasDbContext : DbContext
    {
        public virtual DbSet<Category> Categories { get; set; }
        public virtual DbSet<CatalogItem> CatalogItems { get; set; }
        public virtual DbSet<OrderBatch> OrderBatches { get; set; }
        public virtual DbSet<Order> Orders { get; set; }
        public virtual DbSet<OrderLine> OrderLines { get; set; }
        public virtual DbSet<User> Users { get; set; }

        public OmasDbContext(DbContextOptions options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            /*
            builder.Entity<Category>()
                .HasMany(c => c.CatalogItems)
                .WithOne(ci => ci.Category)
                .HasPrincipalKey(c => c.CategoryId)
                .HasForeignKey(ci => ci.CategoryId);
            */

            builder.Entity<OrderBatch>()
                .HasMany(b => b.Orders)
                .WithOne(o => o.OrderBatch)
                .HasPrincipalKey(b => b.BatchId)
                .HasForeignKey(o => o.BatchId);

            builder.Entity<OrderLine>()
                .HasOne(ol => ol.CatalogItem)
                .WithMany()
                .HasPrincipalKey(ci => ci.Sku)
                .HasForeignKey(ol => ol.Sku);
        }
    }
}
