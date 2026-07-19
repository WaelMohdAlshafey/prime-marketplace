namespace Marketplace.Domain.Entities;

public class OrderItem
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;  // Snapshot at time of purchase
    public decimal UnitPrice { get; set; }                   // Snapshot at time of purchase
    public int Quantity { get; set; }

    // Navigation property
    public virtual Order? Order { get; set; }
}