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

            // Safe total revenue: sum only valid decimals
            var revenueList = await _context.Orders
                .Where(o => o.CurrentStatus == "Paid" && o.TotalAmount != null)
                .Select(o => o.TotalAmount)
                .ToListAsync();

            var totalRevenue = revenueList.Sum(); // now decimal, no nulls

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

    [HttpGet("analytics")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAnalytics()
    {
        try
        {
            // ✅ Top Selling Products (from OrderItems)
            var topSelling = await (from oi in _context.OrderItems
                                    join o in _context.Orders on oi.OrderId equals o.Id
                                    where o.CurrentStatus == "Paid"
                                       || o.CurrentStatus == "Shipped"
                                       || o.CurrentStatus == "Delivered"
                                       || o.CurrentStatus == "In Transit"
                                       || o.CurrentStatus == "Out for Delivery"
                                    group oi by oi.ProductName into g
                                    orderby g.Sum(x => x.Quantity) descending
                                    select new
                                    {
                                        productName = g.Key,
                                        soldCount = g.Sum(x => x.Quantity)
                                    })
                                    .Take(10)
                                    .ToListAsync();

            // ✅ Revenue by Category
            var revenueByCategory = await (from oi in _context.OrderItems
                                           join p in _context.Products on oi.ProductId equals p.Id
                                           join o in _context.Orders on oi.OrderId equals o.Id
                                           where o.CurrentStatus == "Paid"
                                              || o.CurrentStatus == "Shipped"
                                              || o.CurrentStatus == "Delivered"
                                              || o.CurrentStatus == "In Transit"
                                              || o.CurrentStatus == "Out for Delivery"
                                           group new { oi, p } by (p.Category ?? "Uncategorized") into g
                                           orderby g.Sum(x => x.oi.UnitPrice * x.oi.Quantity) descending
                                           select new
                                           {
                                               category = g.Key,
                                               revenue = g.Sum(x => x.oi.UnitPrice * x.oi.Quantity)
                                           })
                                           .ToListAsync();

            // ✅ New Users Growth (last 12 months)
            var twelveMonthsAgo = DateTime.UtcNow.AddMonths(-12);
            var usersGrowth = await _context.Users
                .Where(u => u.CreatedAt >= twelveMonthsAgo)
                .GroupBy(u => new { u.CreatedAt.Year, u.CreatedAt.Month })
                .Select(g => new
                {
                    year = g.Key.Year,
                    month = g.Key.Month,
                    newUsers = g.Count()
                })
                .OrderBy(x => x.year).ThenBy(x => x.month)
                .ToListAsync();

            return Ok(new
            {
                topSelling,
                revenueByCategory,
                usersGrowth
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                message = "Failed to load analytics.",
                error = ex.Message,
                stackTrace = ex.StackTrace
            });
        }
    }
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