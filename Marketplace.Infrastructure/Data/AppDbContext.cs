using Microsoft.EntityFrameworkCore;
using Marketplace.Domain.Entities;

namespace Marketplace.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Product> Products { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<CartItem> CartItems { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<StoreSetting> StoreSettings { get; set; }
    public DbSet<WishlistItem> WishlistItems { get; set; }
    public DbSet<NewsletterSubscription> NewsletterSubscriptions { get; set; }
    public DbSet<ShipmentStatusLog> ShipmentStatusLogs { get; set; }
    public DbSet<Conversation> Conversations { get; set; }
    public DbSet<Message> Messages { get; set; }

    // ✅ NEW: Product Suggestions
    public DbSet<ProductSuggestion> ProductSuggestions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ---- Existing configurations ----

        modelBuilder.Entity<Product>()
            .HasIndex(p => p.VendorId);
        modelBuilder.Entity<Product>()
            .HasIndex(p => p.IsActive);
        modelBuilder.Entity<Product>()
            .Property(p => p.Price)
            .HasPrecision(18, 2);

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<CartItem>()
            .HasIndex(ci => ci.UserId);
        modelBuilder.Entity<CartItem>()
            .HasOne(ci => ci.Product)
            .WithMany()
            .HasForeignKey(ci => ci.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Order>()
            .Property(o => o.TotalAmount)
            .HasPrecision(18, 2);
        modelBuilder.Entity<Order>()
            .HasIndex(o => o.UserId);

        modelBuilder.Entity<OrderItem>()
            .Property(oi => oi.UnitPrice)
            .HasPrecision(18, 2);

        modelBuilder.Entity<WishlistItem>()
            .HasIndex(wi => new { wi.UserId, wi.ProductId })
            .IsUnique();
        modelBuilder.Entity<WishlistItem>()
            .HasOne(wi => wi.Product)
            .WithMany()
            .HasForeignKey(wi => wi.ProductId)
            .OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<WishlistItem>()
            .HasOne(wi => wi.User)
            .WithMany()
            .HasForeignKey(wi => wi.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<NewsletterSubscription>()
            .HasIndex(ns => ns.Email)
            .IsUnique();

        modelBuilder.Entity<ShipmentStatusLog>()
            .HasIndex(s => s.OrderId);
        modelBuilder.Entity<ShipmentStatusLog>()
            .HasOne(s => s.Order)
            .WithMany(o => o.StatusLogs)
            .HasForeignKey(s => s.OrderId)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<ShipmentStatusLog>()
            .HasOne(s => s.UpdatedBy)
            .WithMany()
            .HasForeignKey(s => s.UpdatedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Conversation>()
            .HasIndex(c => new { c.UserId1, c.UserId2 })
            .IsUnique();
        modelBuilder.Entity<Conversation>()
            .HasOne(c => c.User1)
            .WithMany()
            .HasForeignKey(c => c.UserId1)
            .OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<Conversation>()
            .HasOne(c => c.User2)
            .WithMany()
            .HasForeignKey(c => c.UserId2)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Message>()
            .HasOne(m => m.Conversation)
            .WithMany(c => c.Messages)
            .HasForeignKey(m => m.ConversationId)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<Message>()
            .HasOne(m => m.Sender)
            .WithMany()
            .HasForeignKey(m => m.SenderId)
            .OnDelete(DeleteBehavior.Restrict);

        // ✅ NEW: ProductSuggestion configuration
        modelBuilder.Entity<ProductSuggestion>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Status).HasMaxLength(20);
            entity.HasIndex(e => e.Status);
            entity.HasOne(e => e.SuggestedByUser)
                  .WithMany()
                  .HasForeignKey(e => e.SuggestedByUserId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.ReviewedByUser)
                  .WithMany()
                  .HasForeignKey(e => e.ReviewedByUserId)
                  .OnDelete(DeleteBehavior.Restrict);
        });
    }
}