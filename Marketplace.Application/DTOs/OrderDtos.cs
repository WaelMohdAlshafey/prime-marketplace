using System.ComponentModel.DataAnnotations;

namespace Marketplace.Application.DTOs;

// ============================================================
// CREATE ORDER DTO (Full version)
// ============================================================
public class CreateOrderDto
{
    [Required]
    [StringLength(200, MinimumLength = 5)]
    public string ShippingAddress { get; set; } = string.Empty;

    [Required]
    public string PaymentMethod { get; set; } = string.Empty;

    public string? CardNumber { get; set; }
    public string? CardExpiry { get; set; }
    public string? CardCvv { get; set; }
    public string? PhoneNumber { get; set; }
    public string? PayPalEmail { get; set; }
    public string? DeliveryInstructions { get; set; }
    public string? TrackingNumber { get; set; }
    public string? ShippingCarrier { get; set; } // ✅ NEW – Allows user to specify carrier
    public DateTime? ShippedAt { get; set; }
    public DateTime? DeliveredAt { get; set; }
}

// ============================================================
// UPDATE STATUS DTO (for admin)
// ============================================================
public class UpdateStatusDto
{
    public string Status { get; set; } = string.Empty;
}

// ============================================================
// UPDATE STATUS WITH NOTE DTO (for admin with extra fields)
// ============================================================
public class UpdateStatusWithNoteDto
{
    public string Status { get; set; } = string.Empty;
    public string? Note { get; set; }
    public string? Carrier { get; set; } // ✅ NEW – Admin can set/update carrier
}

// ============================================================
// PAYMENT CONFIRMATION DTO
// ============================================================
public class PaymentConfirmationDto
{
    public string? TransactionId { get; set; }
    public string? PhoneNumber { get; set; }
    public string? PayPalEmail { get; set; }
    public string? DeliveryConfirmation { get; set; }
}

// ============================================================
// ORDER DTO (Response)
// ============================================================
public class OrderDto
{
    public int Id { get; set; }
    public DateTime OrderDate { get; set; }
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? ShippingAddress { get; set; }
    public string? PaymentMethod { get; set; }
    public string? PaymentTransactionId { get; set; }
    public string? CardLastFour { get; set; }
    public string? PhoneNumber { get; set; }
    public string? PayPalEmail { get; set; }
    public string? DeliveryInstructions { get; set; }
    public bool IsPaymentConfirmed { get; set; }
    public DateTime? PaymentConfirmedAt { get; set; }
    public string? ShippingCarrier { get; set; } // ✅ NEW – Return carrier in response
    public List<OrderItemDto> Items { get; set; } = new();
}

// ============================================================
// ORDER ITEM DTO
// ============================================================
public class OrderItemDto
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
    public decimal Subtotal => UnitPrice * Quantity;
}