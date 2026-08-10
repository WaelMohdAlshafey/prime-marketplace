using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Marketplace.Infrastructure.Data;
using Marketplace.Domain.Entities;
using System;
using System.Linq;
using System.Threading.Tasks;

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
        try
        {
            // Ensure StoreSettings exists
            await EnsureStoreSettingsExists();

            // --- Safe queries with fallbacks ---
            var totalUsers = await _context.Users.CountAsync();
            var totalProducts = await _context.Products.CountAsync(p => p.IsActive);
            var totalOrders = await _context.Orders.CountAsync();

            // Safe total revenue: try to sum as decimal, fallback to 0
            decimal totalRevenue = 0;
            try
            {
                var revenueQuery = _context.Orders
                    .Where(o => o.CurrentStatus == "Paid")
                    .Select(o => o.TotalAmount);
                var revenueList = await revenueQuery.ToListAsync();
                totalRevenue = revenueList
                    .Select(v => v != null ? decimal.TryParse(v.ToString(), out var d) ? d : 0 : 0)
                    .Sum();
            }
            catch { totalRevenue = 0; }

            var totalSubscribers = await _context.NewsletterSubscriptions
                .CountAsync(ns => ns.IsActive);

            var pendingOrders = await _context.Orders
                .CountAsync(o => o.CurrentStatus == "Pending");

            // Recent Orders
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
        catch (Exception ex)
        {
            // Return a detailed error so you can see what went wrong
            return StatusCode(500, new
            {
                message = "Failed to load dashboard data.",
                error = ex.Message,
                stackTrace = ex.StackTrace
            });
        }
    }

    private async Task EnsureStoreSettingsExists()
    {
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
    }

    // ============================================================
    // ORDERS (separate endpoint)
    // ============================================================
    [HttpGet("orders")]
    public async Task<IActionResult> GetOrders()
    {
        try
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
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Failed to load orders.", error = ex.Message });
        }
    }

    // ============================================================
    // NEWSLETTER
    // ============================================================
    [HttpGet("newsletter")]
    public async Task<IActionResult> GetSubscribers()
    {
        try
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
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Failed to load subscribers.", error = ex.Message });
        }
    }

    [HttpDelete("newsletter/{email}")]
    public async Task<IActionResult> Unsubscribe(string email)
    {
        try
        {
            var subscriber = await _context.NewsletterSubscriptions
                .FirstOrDefaultAsync(ns => ns.Email == email);

            if (subscriber == null)
                return NotFound(new { message = "Subscriber not found." });

            subscriber.IsActive = false;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Unsubscribed successfully." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Failed to unsubscribe.", error = ex.Message });
        }
    }
}