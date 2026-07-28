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
    // CHECKOUT
    // ============================================================
    [HttpPost("checkout")]
    public async Task<IActionResult> Checkout(CreateOrderDto createOrderDto)
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

    // ============================================================
    // GET ALL ORDERS
    // ============================================================
    [HttpGet]
    public async Task<IActionResult> GetOrders()
    {
        var userId = GetUserId();
        var orders = await _orderService.GetOrdersAsync(userId);
        return Ok(orders);
    }

    // ============================================================
    // GET ORDER BY ID
    // ============================================================
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
    // UPDATE ORDER STATUS
    // ============================================================
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusDto request)
    {
        var userId = GetUserId();
        try
        {
            await _orderService.UpdateOrderStatusAsync(userId, id, request.Status);
            return Ok(new { message = $"Order #{id} status updated to '{request.Status}'." });
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // ============================================================
    // CONFIRM PAYMENT
    // ============================================================
    [HttpPost("{id}/confirm-payment")]
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
    // TRACK SHIPMENT – PUBLIC (no auth)
    // ============================================================
    [HttpGet("track/{trackingNumber}")]
    [AllowAnonymous]
    public async Task<IActionResult> TrackShipment(string trackingNumber)
    {
        var order = await _context.Orders
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
            order.Status,
            order.TotalAmount,
            order.OrderDate,
            Items = items
        };

        return Ok(result);
    }
}