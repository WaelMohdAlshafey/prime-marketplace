using Marketplace.Application.DTOs;
using Marketplace.Domain.Entities;

namespace Marketplace.Application.Interfaces;

public interface IOrderService
{
    // ============================================================
    // CART OPERATIONS
    // ============================================================
    Task<CartResponseDto> GetCartAsync(int userId);
    Task<CartResponseDto> AddToCartAsync(int userId, AddToCartDto addToCartDto);
    Task<CartResponseDto> RemoveFromCartAsync(int userId, int cartItemId);
    Task ClearCartAsync(int userId);

    // ============================================================
    // ORDER OPERATIONS
    // ============================================================
    Task<OrderDto> CheckoutAsync(int userId, CreateOrderDto createOrderDto);
    Task<List<OrderDto>> GetOrdersAsync(int userId);
    Task<OrderDto> GetOrderByIdAsync(int userId, int orderId);
    Task UpdateOrderStatusAsync(int userId, int orderId, string status);
    Task<OrderDto> ConfirmPaymentAsync(int userId, int orderId, PaymentConfirmationDto confirmation);

    // ============================================================
    // TRACKING / SHIPMENT STATUS LOG (NEW)
    // ============================================================
    /// <summary>
    /// Updates order status and adds a log entry with optional note.
    /// </summary>
    Task<OrderDto> UpdateOrderStatusWithLogAsync(int userId, int orderId, string newStatus, string? note = null);

    /// <summary>
    /// Gets all status history logs for an order.
    /// </summary>
    Task<List<ShipmentStatusLog>> GetStatusLogsAsync(int orderId);
}