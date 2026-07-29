using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Marketplace.Application.DTOs;
using Marketplace.Application.Interfaces;
using Marketplace.Domain.Entities;
using Marketplace.Infrastructure.Data;

namespace Marketplace.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;
    private readonly AppDbContext _context;

    public OrdersController(IOrderService orderService, AppDbContext context)
    {
        _orderService = orderService;
        _context = context;
    }

    private int GetUserId()
    {
        var claim = User.FindFirst("VendorId") ?? User.FindFirst(ClaimTypes.NameIdentifier);
        return int.Parse(claim!.Value);
    }

    // ============================================================
    // CART ENDPOINTS
    // ============================================================

    [HttpGet("cart")]
    public async Task<IActionResult> GetCart()
    {
        var userId = GetUserId();
        var cart = await _orderService.GetCartAsync(userId);
        return Ok(cart);
    }

    [HttpPost("cart")]
    public async Task<IActionResult> AddToCart([FromBody] AddToCartDto addToCartDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var userId = GetUserId();
            var cart = await _orderService.AddToCartAsync(userId, addToCartDto);
            return Ok(cart);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("cart/{id}")]
    public async Task<IActionResult> RemoveFromCart(int id)
    {
        var userId = GetUserId();
        var cart = await _orderService.RemoveFromCartAsync(userId, id);
        return Ok(cart);
    }

    [HttpDelete("cart")]
    public async Task<IActionResult> ClearCart()
    {
        var userId = GetUserId();
        await _orderService.ClearCartAsync(userId);
        return NoContent();
    }

    // ============================================================
    // ORDER ENDPOINTS
    // ============================================================

    [HttpPost("checkout")]
    public async Task<IActionResult> Checkout([FromBody] CreateOrderDto createOrderDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var userId = GetUserId();
            var order = await _orderService.CheckoutAsync(userId, createOrderDto);
            return Ok(order);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetOrders()
    {
        var userId = GetUserId();
        var orders = await _orderService.GetOrdersAsync(userId);
        return Ok(orders);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetOrderById(int id)
    {
        try
        {
            var userId = GetUserId();
            var order = await _orderService.GetOrderByIdAsync(userId, id);
            return Ok(order);
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // ============================================================
    // ADMIN: CONFIRM PAYMENT
    // ============================================================
    [HttpPost("{id}/confirm-payment")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ConfirmPayment(int id, [FromBody] PaymentConfirmationDto confirmation)
    {
        var userId = GetUserId();
        try
        {
            var order = await _orderService.ConfirmPaymentAsync(userId, id, confirmation);
            return Ok(new { message = "Payment confirmed successfully!", order });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // ============================================================
    // ADMIN: REVERT PAYMENT
    // ============================================================
    [HttpPost("{id}/revert-payment")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> RevertPayment(int id, [FromBody] RevertPaymentDto request)
    {
        var userId = GetUserId();
        try
        {
            var order = await _orderService.RevertPaymentAsync(userId, id, request.Note);
            return Ok(new { message = "Payment reverted successfully!", order });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // ============================================================
    // UPDATE ORDER STATUS – with permissions
    // ============================================================
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusWithNoteDto request)
    {
        try
        {
            var userId = GetUserId();
            var updatedOrder = await _orderService.UpdateOrderStatusAsync(userId, id, request.Status, request.Note);
            return Ok(updatedOrder);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // ============================================================
    // TRACKING – PUBLIC
    // ============================================================
    [HttpGet("track/{trackingNumber}")]
    [AllowAnonymous]
    public async Task<IActionResult> TrackShipment(string trackingNumber)
    {
        var order = await _context.Orders
            .Include(o => o.StatusLogs)
            .ThenInclude(s => s.UpdatedBy)
            .FirstOrDefaultAsync(o => o.TrackingNumber == trackingNumber);

        if (order == null)
            return NotFound(new { message = "Order not found for this tracking number." });

        var items = await _context.OrderItems
            .Where(oi => oi.OrderId == order.Id)
            .Select(oi => new
            {
                oi.ProductName,
                oi.Quantity,
                oi.UnitPrice
            })
            .ToListAsync();

        var result = new
        {
            order.Id,
            order.TrackingNumber,
            order.ShippingCarrier,
            order.ShippedAt,
            order.DeliveredAt,
            order.CurrentStatus,
            order.TotalAmount,
            order.OrderDate,
            Items = items,
            Logs = order.StatusLogs.Select(s => new
            {
                s.Id,
                s.Status,
                s.Note,
                s.CreatedAt,
                UpdatedBy = s.UpdatedBy != null ? new { s.UpdatedBy.Username } : null
            })
        };

        return Ok(result);
    }

    // ============================================================
    // ADMIN: GET ALL ORDERS
    // ============================================================
    [HttpGet("admin/all")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllOrdersForAdmin()
    {
        var orders = await _context.Orders
            .Include(o => o.OrderItems)
            .OrderByDescending(o => o.OrderDate)
            .Select(o => new
            {
                o.Id,
                o.UserId,
                o.OrderDate,
                o.TotalAmount,
                o.CurrentStatus,
                o.ShippingAddress,
                o.PaymentMethod,
                o.IsPaymentConfirmed,
                o.PaymentConfirmedAt,
                Items = o.OrderItems.Select(oi => new
                {
                    oi.ProductId,
                    oi.ProductName,
                    oi.UnitPrice,
                    oi.Quantity,
                    Subtotal = oi.UnitPrice * oi.Quantity
                })
            })
            .ToListAsync();

        return Ok(orders);
    }
}

// ============================================================
// DTOs
// ============================================================

public class UpdateStatusWithNoteDto
{
    public string Status { get; set; } = string.Empty;
    public string? Note { get; set; }
}

public class RevertPaymentDto
{
    public string? Note { get; set; }
}