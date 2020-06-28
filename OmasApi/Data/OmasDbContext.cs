using Microsoft.EntityFrameworkCore;

namespace OmasApi.Data
{
    public class OmasDbContext : DbContext
    {
        private readonly string _connectionString;

        public virtual DbSet<Category> Categories { get; set; }
        public virtual DbSet<CatalogItem> CatalogItems { get; set; }
        public virtual DbSet<OrderBatch> OrderBatches { get; set; }
        public virtual DbSet<Order> OrderItems { get; set; }
        public virtual DbSet<User> Users { get; set; }

        public OmasDbContext(DbContextOptions options) : base(options) { }

        public OmasDbContext(string connectionString)
        {
            _connectionString = connectionString;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            if (!_connectionString.IsNullOrEmpty())
            {
                options.UseSqlServer(_connectionString);
            }
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Category>()
                .HasMany(c => c.CatalogItems)
                .WithOne(ci => ci.Category)
                .HasPrincipalKey(c => c.CategoryId)
                .HasForeignKey(ci => ci.CategoryId);

            builder.Entity<OrderBatch>()
                .HasMany(b => b.OrderItems)
                .WithOne(o => o.OrderBatch)
                .HasPrincipalKey(b => b.BatchId)
                .HasForeignKey(o => o.BatchId);
        }
    }
}
