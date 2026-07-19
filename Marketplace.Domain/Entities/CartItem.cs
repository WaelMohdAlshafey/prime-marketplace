namespace Marketplace.Domain.Entities;

public class CartItem
{
    public int Id { get; set; }
    public int UserId { get; set; }        // The buyer (VendorId from token)
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    public DateTime AddedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public virtual Product? Product { get; set; }
}