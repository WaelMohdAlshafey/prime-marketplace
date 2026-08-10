using System;

namespace Marketplace.Domain.Entities;

public class ProductReview
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public int UserId { get; set; }
    public int Rating { get; set; } // 1-5
    public string? Review { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual Product? Product { get; set; }
    public virtual User? User { get; set; }
}