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
            await EnsureStoreSettingsExists();

            var totalUsers = await _context.Users.CountAsync();
            var totalProducts = await _context.Products.CountAsync(p => p.IsActive);
            var totalOrders = await _context.Orders.CountAsync();

            // Total revenue – parse in memory
            var revenueList = await _context.Orders
                .Where(o => o.CurrentStatus == "Paid")
                .Select(o => o.TotalAmount)
                .ToListAsync();
            var totalRevenue = revenueList
                .Select(v => decimal.TryParse(v?.ToString(), out var d) ? d : 0)
                .Sum();

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

            // Monthly revenue – parse in memory to avoid Sum() casting issues
            var monthlyData = await _context.Orders
                .Where(o => o.CurrentStatus == "Paid" && o.OrderDate >= DateTime.UtcNow.AddMonths(-12))
                .Select(o => new { o.OrderDate.Year, o.OrderDate.Month, o.TotalAmount })
                .ToListAsync();

            var monthlyRevenue = monthlyData
                .GroupBy(o => new { o.Year, o.Month })
                .Select(g => new
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    Total = g.Sum(o => decimal.TryParse(o.TotalAmount?.ToString(), out var d) ? d : 0)
                })
                .OrderBy(x => x.Year).ThenBy(x => x.Month)
                .ToList();

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
            // Load orders first
            var orders = await _context.Orders
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            // Load all order items in one go
            var orderIds = orders.Select(o => o.Id).ToList();
            var allOrderItems = await _context.OrderItems
                .Where(oi => orderIds.Contains(oi.OrderId))
                .ToListAsync();

            // Build the result in memory
            var result = orders.Select(o => new
            {
                o.Id,
                o.UserId,
                o.OrderDate,
                TotalAmount = decimal.TryParse(o.TotalAmount?.ToString(), out var ta) ? ta : 0,
                Status = o.CurrentStatus,
                o.ShippingAddress,
                o.PaymentMethod,
                o.IsPaymentConfirmed,
                o.PaymentConfirmedAt,
                Items = allOrderItems
                    .Where(oi => oi.OrderId == o.Id)
                    .Select(oi => new
                    {
                        oi.ProductId,
                        oi.ProductName,
                        UnitPrice = decimal.TryParse(oi.UnitPrice?.ToString(), out var up) ? up : 0,
                        oi.Quantity,
                        Subtotal = (decimal.TryParse(oi.UnitPrice?.ToString(), out var up2) ? up2 : 0) * oi.Quantity
                    })
                    .ToList()
            }).ToList();

            return Ok(result);
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