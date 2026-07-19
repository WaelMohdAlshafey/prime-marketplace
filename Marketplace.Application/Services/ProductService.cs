using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Marketplace.Application.DTOs;
using Marketplace.Application.Interfaces;
using Marketplace.Domain.Entities;
using Marketplace.Infrastructure.Data;

namespace Marketplace.Application.Services;

public class ProductService : IProductService
{
    private readonly AppDbContext _context;
    private readonly IMemoryCache _cache;

    public ProductService(AppDbContext context, IMemoryCache cache)
    {
        _context = context;
        _cache = cache;
    }

    // ============================================================
    // PUBLIC ENDPOINTS (No authentication required)
    // ============================================================

    public async Task<PagedResult<ProductDto>> GetProductsAsync(int page, int pageSize)
    {
        string cacheKey = $"Products_Page_{page}_Size_{pageSize}";

        if (_cache.TryGetValue(cacheKey, out PagedResult<ProductDto>? cachedResult) && cachedResult != null)
        {
            return cachedResult;
        }

        page = Math.Max(1, page);
        pageSize = Math.Max(1, pageSize);

        var totalCount = await _context.Products
            .Where(p => p.IsActive)
            .CountAsync();

        var products = await _context.Products
            .Where(p => p.IsActive)
            .OrderBy(p => p.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => MapToDto(p))
            .ToListAsync();

        var result = new PagedResult<ProductDto>
        {
            Items = products,
            TotalCount = totalCount,
            PageNumber = page,
            PageSize = pageSize
        };

        _cache.Set(cacheKey, result, TimeSpan.FromMinutes(5));
        return result;
    }

    public async Task<PagedResult<ProductDto>> SearchProductsAsync(string searchTerm, int page, int pageSize)
    {
        string cacheKey = $"Search_{searchTerm?.ToLower() ?? "all"}_Page_{page}_Size_{pageSize}";

        if (_cache.TryGetValue(cacheKey, out PagedResult<ProductDto>? cachedResult) && cachedResult != null)
        {
            return cachedResult;
        }

        page = Math.Max(1, page);
        pageSize = Math.Max(1, pageSize);

        var query = _context.Products
            .Where(p => p.IsActive);

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.ToLower();
            query = query.Where(p =>
                p.Name.ToLower().Contains(term) ||
                p.Description.ToLower().Contains(term));
        }

        var totalCount = await query.CountAsync();

        var products = await query
            .OrderBy(p => p.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => MapToDto(p))
            .ToListAsync();

        var result = new PagedResult<ProductDto>
        {
            Items = products,
            TotalCount = totalCount,
            PageNumber = page,
            PageSize = pageSize
        };

        _cache.Set(cacheKey, result, TimeSpan.FromMinutes(5));
        return result;
    }

    public async Task<PagedResult<ProductDto>> GetProductsFilteredAsync(
        string? searchTerm,
        decimal? minPrice,
        decimal? maxPrice,
        int? vendorId,
        bool? inStock,
        int page,
        int pageSize)
    {
        string cacheKey = $"Filter_{searchTerm ?? "all"}_{minPrice}_{maxPrice}_{vendorId}_{inStock}_P{page}_S{pageSize}";

        if (_cache.TryGetValue(cacheKey, out PagedResult<ProductDto>? cachedResult) && cachedResult != null)
        {
            return cachedResult;
        }

        page = Math.Max(1, page);
        pageSize = Math.Max(1, pageSize);

        var query = _context.Products
            .Where(p => p.IsActive);

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.ToLower();
            query = query.Where(p =>
                p.Name.ToLower().Contains(term) ||
                p.Description.ToLower().Contains(term));
        }

        if (minPrice.HasValue)
            query = query.Where(p => p.Price >= minPrice.Value);

        if (maxPrice.HasValue)
            query = query.Where(p => p.Price <= maxPrice.Value);

        if (vendorId.HasValue)
            query = query.Where(p => p.VendorId == vendorId.Value);

        if (inStock.HasValue && inStock.Value)
            query = query.Where(p => p.StockQuantity > 0);

        var totalCount = await query.CountAsync();

        var products = await query
            .OrderBy(p => p.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => MapToDto(p))
            .ToListAsync();

        var result = new PagedResult<ProductDto>
        {
            Items = products,
            TotalCount = totalCount,
            PageNumber = page,
            PageSize = pageSize
        };

        _cache.Set(cacheKey, result, TimeSpan.FromMinutes(5));
        return result;
    }

    public async Task<ProductDto> GetProductByIdAsync(int id)
    {
        var product = await _context.Products
            .Where(p => p.IsActive && p.Id == id)
            .Select(p => MapToDto(p))
            .FirstOrDefaultAsync();

        if (product == null)
            throw new Exception("Product not found.");

        return product;
    }

    // ============================================================
    // VENDOR ENDPOINTS (Authentication required)
    // ============================================================

    public async Task<PagedResult<ProductDto>> GetVendorProductsAsync(int vendorId, int page, int pageSize)
    {
        string cacheKey = $"Vendor_{vendorId}_Products_Page_{page}_Size_{pageSize}";

        if (_cache.TryGetValue(cacheKey, out PagedResult<ProductDto>? cachedResult) && cachedResult != null)
        {
            return cachedResult;
        }

        page = Math.Max(1, page);
        pageSize = Math.Max(1, pageSize);

        var query = _context.Products
            .Where(p => p.IsActive && p.VendorId == vendorId);

        var totalCount = await query.CountAsync();

        var products = await query
            .OrderBy(p => p.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => MapToDto(p))
            .ToListAsync();

        var result = new PagedResult<ProductDto>
        {
            Items = products,
            TotalCount = totalCount,
            PageNumber = page,
            PageSize = pageSize
        };

        _cache.Set(cacheKey, result, TimeSpan.FromMinutes(5));
        return result;
    }

    // ============================================================
    // CREATE / UPDATE / DELETE (Using Product entity directly)
    // ============================================================

    public async Task<ProductDto> CreateProductAsync(Product product, int vendorId)
    {
        product.VendorId = vendorId;
        product.CreatedAt = DateTime.UtcNow;
        product.IsActive = true;

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        ClearProductCaches(vendorId);

        return MapToDto(product);
    }

    public async Task<ProductDto> UpdateProductAsync(Product product, int vendorId)
    {
        var existing = await _context.Products
            .FirstOrDefaultAsync(p => p.Id == product.Id && p.VendorId == vendorId);

        if (existing == null)
            throw new Exception("Product not found or you do not have permission to edit it.");

        existing.Name = product.Name;
        existing.Description = product.Description;
        existing.Price = product.Price;
        existing.CostPrice = product.CostPrice;
        existing.StockQuantity = product.StockQuantity;
        existing.IsActive = product.IsActive;

        if (!string.IsNullOrEmpty(product.ImageUrl))
            existing.ImageUrl = product.ImageUrl;

        await _context.SaveChangesAsync();

        ClearProductCaches(vendorId);

        return MapToDto(existing);
    }

    public async Task<bool> DeleteProductAsync(int productId, int vendorId)
    {
        var product = await _context.Products
            .FirstOrDefaultAsync(p => p.Id == productId && p.VendorId == vendorId);

        if (product == null)
            return false;

        product.IsActive = false;
        await _context.SaveChangesAsync();

        ClearProductCaches(vendorId);

        return true;
    }

    // ============================================================
    // PRIVATE HELPERS
    // ============================================================

    private static ProductDto MapToDto(Product product)
    {
        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            StockQuantity = product.StockQuantity,
            ImageUrl = product.ImageUrl
            // CostPrice is intentionally excluded from public DTO
        };
    }

    private void ClearProductCaches(int vendorId)
    {
        _cache.Remove($"Products_Page_1_Size_20");
        _cache.Remove($"Products_Page_1_Size_10");
        _cache.Remove($"Vendor_{vendorId}_Products_Page_1_Size_20");
        _cache.Remove($"Search_all_Page_1_Size_20");
    }
}