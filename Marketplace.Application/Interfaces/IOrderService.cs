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
    Task<OrderDto> ConfirmPaymentAsync(int userId, int orderId, PaymentConfirmationDto confirmation);
    Task<OrderDto> RevertPaymentAsync(int userId, int orderId, string? note = null);

    // ✅ Updated signature: adds optional carrier parameter
    Task<OrderDto> UpdateOrderStatusAsync(int userId, int orderId, string newStatus, string? note = null, string? carrier = null);

    // ============================================================
    // STATUS LOGS
    // ============================================================
    Task<List<ShipmentStatusLog>> GetStatusLogsAsync(int orderId);
}