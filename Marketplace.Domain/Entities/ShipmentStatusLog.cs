namespace Marketplace.Domain.Entities;

public class ShipmentStatusLog
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public string Status { get; set; } = string.Empty; // e.g., "Packaging", "Shipped", "In Transit", "Out for Delivery", "Delivered"
    public string? Note { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public int UpdatedByUserId { get; set; } // Admin or Vendor who updated

    // Navigation
    public virtual Order? Order { get; set; }
    public virtual User? UpdatedBy { get; set; }
}