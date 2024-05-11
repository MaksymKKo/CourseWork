using Microsoft.EntityFrameworkCore;
using Shop.Infrastructure;
using Shop.Models.Tabels;

namespace Shop.Models
{
    public class ShopContext:DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<OrderProduct> OrderProducts { get; set; }
        public DbSet<Category> Category { get; set; }

        public ShopContext(DbContextOptions<ShopContext> options) : base(options)
        {
            Database.EnsureCreated();
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
            .HasKey(u => u.Id);

            modelBuilder.Entity<User>()
                .HasMany(u => u.Orders)
                .WithOne(o => o.User)
                .HasForeignKey(o => o.User_id)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Order>()
                .HasKey(o => o.Id);

            modelBuilder.Entity<Order>()
                .HasMany(o => o.OrderProducts)
                .WithOne(op => op.Orders)
                .HasForeignKey(op => op.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<OrderProduct>()
                .HasKey(op => op.Id);

            modelBuilder.Entity<Product>()
                .HasKey(p => p.Id);

            modelBuilder.Entity<Product>()
                .HasOne(p => p.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.Category_id)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Category>()
                .HasKey(c => c.Id);

            modelBuilder.Entity<Category>()
                .HasMany(c => c.Products)
                .WithOne(p => p.Category)
                .HasForeignKey(p => p.Category_id)
                .OnDelete(DeleteBehavior.NoAction);

            User AdminUser = new User() { Id = 1, Email = "admin@gmail.com", Password = MyExt.HashPassword("admin1"), Role = "admin" };
            modelBuilder.Entity<User>().HasData(new User[] { AdminUser });
            base.OnModelCreating(modelBuilder);
        }
    }
}
