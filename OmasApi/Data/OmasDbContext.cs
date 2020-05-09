using Microsoft.EntityFrameworkCore;

namespace OmasApi.Data
{
    public class OmasDbContext : DbContext
    {
        public virtual DbSet<Category> Categories { get; set; }
        public virtual DbSet<CatalogItem> CatalogItems { get; set; }
        public virtual DbSet<OrderBatch> OrderBatches { get; set; }
        public virtual DbSet<Order> OrderItems { get; set; }
        public virtual DbSet<User> Users { get; set; }

        public OmasDbContext(DbContextOptions options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Category>()
                .HasMany(c => c.CatalogItems)
                .WithOne(ci => ci.Category)
                .HasPrincipalKey(c => c.CategoryId)
                .HasForeignKey(ci => ci.CategoryId);

            builder.Entity<OrderBatch>()
                .HasMany(b => b.CatalogItems)
                .WithOne(c => c.OrderBatch)
                .HasPrincipalKey(b => b.BatchId)
                .HasForeignKey(c => c.BatchId);

            builder.Entity<OrderBatch>()
                .HasMany(b => b.OrderItems)
                .WithOne(o => o.OrderBatch)
                .HasPrincipalKey(b => b.BatchId)
                .HasForeignKey(o => o.BatchId);
        }
    }
}
