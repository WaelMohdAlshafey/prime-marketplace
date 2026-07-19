using Marketplace.Application.DTOs;

namespace Marketplace.Application.Interfaces;

public interface IOrderService
{
    // Cart operations
    Task<CartResponseDto> GetCartAsync(int userId);
    Task<CartResponseDto> AddToCartAsync(int userId, AddToCartDto addToCartDto);
    Task<CartResponseDto> RemoveFromCartAsync(int userId, int cartItemId);
    Task ClearCartAsync(int userId);

    // Order operations
    Task<OrderDto> CheckoutAsync(int userId, CreateOrderDto createOrderDto);
    Task<List<OrderDto>> GetOrdersAsync(int userId); // Returns a list ✅
    Task<OrderDto> GetOrderByIdAsync(int userId, int orderId);
    Task UpdateOrderStatusAsync(int userId, int orderId, string status);
    Task<OrderDto> ConfirmPaymentAsync(int userId, int orderId, PaymentConfirmationDto confirmation);
}