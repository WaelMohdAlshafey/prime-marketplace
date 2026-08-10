using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Marketplace.Infrastructure.Data;
using Marketplace.Domain.Entities;

namespace Marketplace.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _context;

    public AdminController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboardStats()
    {
        // 🔹 Ensure StoreSettings has a default row (if missing)
        var settings = await _context.StoreSettings.FirstOrDefaultAsync();
        if (settings == null)
        {
            _context.StoreSettings.Add(new StoreSetting
            {
                StoreName = "Prime",
                Address = "Default Address",
                Location = "Default Location",
                OwnersJson = "[]",
                MobileNumbersJson = "[]",
                EmailsJson = "[]",
                Landline = "N/A",
                WhatsApp = "N/A",
                Template = "standard"
            });
            await _context.SaveChangesAsync();
        }

        // 🔹 Get stats (with null checks)
        var totalUsers = await _context.Users.CountAsync();
        var totalProducts = await _context.Products.CountAsync(p => p.IsActive);
        var totalOrders = await _context.Orders.CountAsync();
        var totalRevenue = await _context.Orders
            .Where(o => o.CurrentStatus == "Paid")
            .SumAsync(o => (decimal?)o.TotalAmount) ?? 0;
        var totalSubscribers = await _context.NewsletterSubscriptions
            .CountAsync(ns => ns.IsActive);
        var pendingOrders = await _context.Orders
            .CountAsync(o => o.CurrentStatus == "Pending");

        var recentOrders = await _context.Orders
            .OrderByDescending(o => o.OrderDate)
            .Take(10)
            .Select(o => new
            {
                o.Id,
                o.OrderDate,
                o.TotalAmount,
                Status = o.CurrentStatus,
                o.UserId
            })
            .ToListAsync();

        var usersByRole = await _context.Users
            .GroupBy(u => u.Role)
            .Select(g => new { Role = g.Key, Count = g.Count() })
            .ToListAsync();

        var ordersByStatus = await _context.Orders
            .GroupBy(o => o.CurrentStatus)
            .Select(g => new { Status = g.Key, Count = g.Count() })
            .ToListAsync();

        var monthlyRevenue = await _context.Orders
            .Where(o => o.CurrentStatus == "Paid" && o.OrderDate >= DateTime.UtcNow.AddMonths(-12))
            .GroupBy(o => new { o.OrderDate.Year, o.OrderDate.Month })
            .Select(g => new
            {
                Year = g.Key.Year,
                Month = g.Key.Month,
                Total = g.Sum(o => o.TotalAmount)
            })
            .OrderBy(x => x.Year).ThenBy(x => x.Month)
            .ToListAsync();

        return Ok(new
        {
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue,
            totalSubscribers,
            pendingOrders,
            recentOrders,
            usersByRole,
            ordersByStatus,
            monthlyRevenue
        });
    }

    // ============================================================
    // ORDERS (if you want to keep separate endpoint)
    // ============================================================
    [HttpGet("orders")]
    public async Task<IActionResult> GetOrders()
    {
        var orders = await _context.Orders
            .OrderByDescending(o => o.OrderDate)
            .Select(o => new
            {
                o.Id,
                o.UserId,
                o.OrderDate,
                o.TotalAmount,
                Status = o.CurrentStatus,
                o.ShippingAddress,
                o.PaymentMethod,
                o.IsPaymentConfirmed,
                o.PaymentConfirmedAt,
                Items = _context.OrderItems
                    .Where(oi => oi.OrderId == o.Id)
                    .Select(oi => new
                    {
                        oi.ProductId,
                        oi.ProductName,
                        oi.UnitPrice,
                        oi.Quantity,
                        Subtotal = oi.UnitPrice * oi.Quantity
                    })
                    .ToList()
            })
            .ToListAsync();

        return Ok(orders);
    }

    // ============================================================
    // NEWSLETTER
    // ============================================================
    [HttpGet("newsletter")]
    public async Task<IActionResult> GetSubscribers()
    {
        var subscribers = await _context.NewsletterSubscriptions
            .OrderByDescending(ns => ns.SubscribedAt)
            .Select(ns => new
            {
                ns.Id,
                ns.Email,
                ns.SubscribedAt,
                ns.IsActive
            })
            .ToListAsync();

        return Ok(subscribers);
    }

    [HttpDelete("newsletter/{email}")]
    public async Task<IActionResult> Unsubscribe(string email)
    {
        var subscriber = await _context.NewsletterSubscriptions
            .FirstOrDefaultAsync(ns => ns.Email == email);

        if (subscriber == null)
            return NotFound(new { message = "Subscriber not found." });

        subscriber.IsActive = false;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Unsubscribed successfully." });
    }
}