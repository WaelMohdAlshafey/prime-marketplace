using Microsoft.EntityFrameworkCore;
using Marketplace.Application.Interfaces;
using Marketplace.Domain.Entities;
using Marketplace.Infrastructure.Data;

namespace Marketplace.Application.Services;

public class WishlistService : IWishlistService
{
    private readonly AppDbContext _context;

    public WishlistService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<int>> GetUserWishlistIdsAsync(int userId)
    {
        return await _context.WishlistItems
            .Where(wi => wi.UserId == userId)
            .Select(wi => wi.ProductId)
            .ToListAsync();
    }

    public async Task AddToWishlistAsync(int userId, int productId)
    {
        var exists = await _context.WishlistItems
            .AnyAsync(wi => wi.UserId == userId && wi.ProductId == productId);
        if (exists) return;

        var item = new WishlistItem { UserId = userId, ProductId = productId };
        _context.WishlistItems.Add(item);
        await _context.SaveChangesAsync();
    }

    public async Task RemoveFromWishlistAsync(int userId, int productId)
    {
        var item = await _context.WishlistItems
            .FirstOrDefaultAsync(wi => wi.UserId == userId && wi.ProductId == productId);
        if (item != null)
        {
            _context.WishlistItems.Remove(item);
            await _context.SaveChangesAsync();
        }
    }
}