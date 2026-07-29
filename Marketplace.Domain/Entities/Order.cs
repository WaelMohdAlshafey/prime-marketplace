namespace Marketplace.Domain.Entities;

public class Order
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = "Pending"; // Pending, Paid, Shipped, Delivered, Cancelled
    public string? ShippingAddress { get; set; }
    public string? PaymentMethod { get; set; }
    public string? TrackingNumber { get; set; }
    public string? ShippingCarrier { get; set; } // e.g., "DHL", "Aramex"
    public DateTime? ShippedAt { get; set; }
    public DateTime? DeliveredAt { get; set; }
    public string CurrentStatus { get; set; } = "Pending"; // This will be the latest status
    public virtual ICollection<ShipmentStatusLog> StatusLogs { get; set; } = new List<ShipmentStatusLog>();
    // ============================================================
    // PAYMENT DETAILS
    // ============================================================
    public string? PaymentTransactionId { get; set; } // For tracking
    public string? CardLastFour { get; set; }         // For card payments
    public string? PhoneNumber { get; set; }          // For mobile wallet
    public string? PayPalEmail { get; set; }          // For PayPal
    public string? DeliveryInstructions { get; set; } // For Cash on Delivery
    public bool IsPaymentConfirmed { get; set; } = false;
    public DateTime? PaymentConfirmedAt { get; set; }

    // Navigation property
    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}