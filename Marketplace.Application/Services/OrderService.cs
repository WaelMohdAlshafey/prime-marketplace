using Microsoft.EntityFrameworkCore;
using Marketplace.Application.DTOs;
using Marketplace.Application.Interfaces;
using Marketplace.Domain.Entities;
using Marketplace.Infrastructure.Data;

namespace Marketplace.Application.Services;

public class OrderService : IOrderService
{
    private readonly AppDbContext _context;

    public OrderService(AppDbContext context)
    {
        _context = context;
    }

    // ============================================================
    // CART OPERATIONS
    // ============================================================

    public async Task<CartResponseDto> GetCartAsync(int userId)
    {
        var cartItems = await _context.CartItems
            .Where(ci => ci.UserId == userId)
            .Include(ci => ci.Product)
            .Select(ci => new CartItemDto
            {
                Id = ci.Id,
                ProductId = ci.ProductId,
                ProductName = ci.Product != null ? ci.Product.Name : "Product Unavailable",
                UnitPrice = ci.Product != null ? ci.Product.Price : 0,
                Quantity = ci.Quantity
            })
            .ToListAsync();

        return new CartResponseDto { Items = cartItems };
    }

    public async Task<CartResponseDto> AddToCartAsync(int userId, AddToCartDto addToCartDto)
    {
        var product = await _context.Products
            .FirstOrDefaultAsync(p => p.Id == addToCartDto.ProductId && p.IsActive);

        if (product == null)
            throw new Exception("Product not available.");

        if (product.StockQuantity < addToCartDto.Quantity)
            throw new Exception($"Only {product.StockQuantity} items available.");

        var existingItem = await _context.CartItems
            .FirstOrDefaultAsync(ci => ci.UserId == userId && ci.ProductId == addToCartDto.ProductId);

        if (existingItem != null)
        {
            existingItem.Quantity += addToCartDto.Quantity;
            if (existingItem.Quantity > product.StockQuantity)
                existingItem.Quantity = product.StockQuantity;
        }
        else
        {
            var cartItem = new CartItem
            {
                UserId = userId,
                ProductId = addToCartDto.ProductId,
                Quantity = addToCartDto.Quantity,
                AddedAt = DateTime.UtcNow
            };
            _context.CartItems.Add(cartItem);
        }

        await _context.SaveChangesAsync();
        return await GetCartAsync(userId);
    }

    public async Task<CartResponseDto> RemoveFromCartAsync(int userId, int cartItemId)
    {
        var cartItem = await _context.CartItems
            .FirstOrDefaultAsync(ci => ci.Id == cartItemId && ci.UserId == userId);

        if (cartItem != null)
        {
            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();
        }

        return await GetCartAsync(userId);
    }

    public async Task ClearCartAsync(int userId)
    {
        var cartItems = await _context.CartItems
            .Where(ci => ci.UserId == userId)
            .ToListAsync();

        if (cartItems.Any())
        {
            _context.CartItems.RemoveRange(cartItems);
            await _context.SaveChangesAsync();
        }
    }

    // ============================================================
    // ORDER OPERATIONS
    // ============================================================

    public async Task<OrderDto> CheckoutAsync(int userId, CreateOrderDto createOrderDto)
    {
        var cart = await GetCartAsync(userId);
        if (!cart.Items.Any())
            throw new Exception("Your cart is empty.");

        foreach (var item in cart.Items)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.Id == item.ProductId && p.IsActive);

            if (product == null)
                throw new Exception($"Product '{item.ProductName}' is no longer available.");

            if (product.StockQuantity < item.Quantity)
                throw new Exception($"Not enough stock for '{product.Name}'. Available: {product.StockQuantity}");
        }

        var order = new Order
        {
            UserId = userId,
            OrderDate = DateTime.UtcNow,
            TotalAmount = cart.TotalAmount,
            Status = "Pending",
            ShippingAddress = createOrderDto.ShippingAddress,
            PaymentMethod = createOrderDto.PaymentMethod,
            PhoneNumber = createOrderDto.PhoneNumber,
            PayPalEmail = createOrderDto.PayPalEmail,
            DeliveryInstructions = createOrderDto.DeliveryInstructions,
            IsPaymentConfirmed = false
        };

        if (!string.IsNullOrEmpty(createOrderDto.CardNumber) && createOrderDto.CardNumber.Length >= 4)
        {
            order.CardLastFour = createOrderDto.CardNumber.Substring(createOrderDto.CardNumber.Length - 4);
        }

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        foreach (var item in cart.Items)
        {
            var product = await _context.Products.FindAsync(item.ProductId);
            if (product != null)
            {
                var orderItem = new OrderItem
                {
                    OrderId = order.Id,
                    ProductId = item.ProductId,
                    ProductName = product.Name,
                    UnitPrice = product.Price,
                    Quantity = item.Quantity
                };
                _context.OrderItems.Add(orderItem);
                product.StockQuantity -= item.Quantity;
            }
        }

        await ClearCartAsync(userId);
        await _context.SaveChangesAsync();

        return await GetOrderByIdAsync(userId, order.Id);
    }

    // ============================================================
    // FIXED: Return type is List<OrderDto> to match interface
    // ============================================================
    public async Task<List<OrderDto>> GetOrdersAsync(int userId)
    {
        var orders = await _context.Orders
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.OrderDate)
            .ToListAsync();

        var orderDtos = new List<OrderDto>();
        foreach (var order in orders)
        {
            orderDtos.Add(await GetOrderByIdAsync(userId, order.Id));
        }

        return orderDtos;
    }

    public async Task<OrderDto> GetOrderByIdAsync(int userId, int orderId)
    {
        var order = await _context.Orders
            .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId);

        if (order == null)
            throw new Exception("Order not found.");

        var items = await _context.OrderItems
            .Where(oi => oi.OrderId == orderId)
            .Select(oi => new OrderItemDto
            {
                ProductId = oi.ProductId,
                ProductName = oi.ProductName,
                UnitPrice = oi.UnitPrice,
                Quantity = oi.Quantity
            })
            .ToListAsync();

        return new OrderDto
        {
            Id = order.Id,
            OrderDate = order.OrderDate,
            TotalAmount = order.TotalAmount,
            Status = order.Status,
            ShippingAddress = order.ShippingAddress,
            PaymentMethod = order.PaymentMethod,
            PaymentTransactionId = order.PaymentTransactionId,
            CardLastFour = order.CardLastFour,
            PhoneNumber = order.PhoneNumber,
            PayPalEmail = order.PayPalEmail,
            DeliveryInstructions = order.DeliveryInstructions,
            IsPaymentConfirmed = order.IsPaymentConfirmed,
            PaymentConfirmedAt = order.PaymentConfirmedAt,
            Items = items
        };
    }

    public async Task UpdateOrderStatusAsync(int userId, int orderId, string status)
    {
        var order = await _context.Orders
            .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId);

        if (order == null)
            throw new Exception("Order not found.");

        order.Status = status;
        await _context.SaveChangesAsync();
    }

    public async Task<OrderDto> ConfirmPaymentAsync(int userId, int orderId, PaymentConfirmationDto confirmation)
    {
        var order = await _context.Orders
            .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId);

        if (order == null)
            throw new Exception("Order not found.");

        if (order.IsPaymentConfirmed)
            throw new Exception("Payment already confirmed.");

        switch (order.PaymentMethod)
        {
            case "Card":
                if (string.IsNullOrEmpty(confirmation.TransactionId))
                    throw new Exception("Transaction ID is required for card payments.");
                order.PaymentTransactionId = confirmation.TransactionId;
                break;

            case "MobileWallet":
                if (string.IsNullOrEmpty(confirmation.PhoneNumber) || confirmation.PhoneNumber.Length < 10)
                    throw new Exception("Valid phone number is required for mobile wallet.");
                order.PhoneNumber = confirmation.PhoneNumber;
                break;

            case "PayPal":
                if (string.IsNullOrEmpty(confirmation.PayPalEmail) || !confirmation.PayPalEmail.Contains("@"))
                    throw new Exception("Valid PayPal email is required.");
                order.PayPalEmail = confirmation.PayPalEmail;
                break;

            case "CashOnDelivery":
                if (string.IsNullOrEmpty(confirmation.DeliveryConfirmation))
                    throw new Exception("Delivery confirmation is required.");
                order.DeliveryInstructions = confirmation.DeliveryConfirmation;
                break;

            default:
                throw new Exception($"Unknown payment method: {order.PaymentMethod}");
        }

        order.IsPaymentConfirmed = true;
        order.PaymentConfirmedAt = DateTime.UtcNow;
        order.Status = "Paid";

        await _context.SaveChangesAsync();

        return await GetOrderByIdAsync(userId, orderId);
    }
}