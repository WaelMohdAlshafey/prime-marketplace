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

    // 🔧 FIXED: Map to DTO – prioritize main Name & Description
    private static ProductDto MapToDto(Product product, string? vendorName = null)
    {
        return new ProductDto
        {
            Id = product.Id,
            // ✅ Use main Name and Description as primary, fallback to bilingual
            Name = !string.IsNullOrEmpty(product.Name) ? product.Name : (product.NameAr ?? product.NameEn ?? string.Empty),
            Description = !string.IsNullOrEmpty(product.Description) ? product.Description : (product.DescriptionAr ?? product.DescriptionEn ?? string.Empty),
            // Keep bilingual fields for reference
            NameAr = product.NameAr,
            NameEn = product.NameEn,
            DescriptionAr = product.DescriptionAr,
            DescriptionEn = product.DescriptionEn,
            Price = product.Price,
            StockQuantity = product.StockQuantity,
            ImageUrl = product.ImageUrl,
            VendorName = vendorName ?? "بائع",
            Rating = product.Rating,
            IsActive = product.IsActive,
            Category = product.Category
        };
    }

    private void ClearProductCaches(int vendorId)
    {
        _cache.Remove($"Products_Page_1_Size_20");
        _cache.Remove($"Products_Page_1_Size_10");
        _cache.Remove($"Vendor_{vendorId}_Products_Page_1_Size_20");
        _cache.Remove($"Search_all_Page_1_Size_20");
    }

    // ============================================================
    // GET PRODUCTS
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

        var query = from p in _context.Products
                    join u in _context.Users on p.VendorId equals u.Id into vendorGroup
                    from u in vendorGroup.DefaultIfEmpty()
                    where p.IsActive
                    select new { p, VendorName = u != null ? u.Username : "بائع" };

        var totalCount = await _context.Products.Where(p => p.IsActive).CountAsync();

        var products = await query
            .OrderBy(x => x.p.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new ProductDto
            {
                Id = x.p.Id,
                Name = !string.IsNullOrEmpty(x.p.Name) ? x.p.Name : (x.p.NameAr ?? x.p.NameEn ?? string.Empty),
                Description = !string.IsNullOrEmpty(x.p.Description) ? x.p.Description : (x.p.DescriptionAr ?? x.p.DescriptionEn ?? string.Empty),
                NameAr = x.p.NameAr,
                NameEn = x.p.NameEn,
                DescriptionAr = x.p.DescriptionAr,
                DescriptionEn = x.p.DescriptionEn,
                Price = x.p.Price,
                StockQuantity = x.p.StockQuantity,
                ImageUrl = x.p.ImageUrl,
                VendorName = x.VendorName,
                Rating = x.p.Rating,
                IsActive = x.p.IsActive,
                Category = x.p.Category
            })
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
    // SEARCH PRODUCTS
    // ============================================================
    public async Task<PagedResult<ProductDto>> SearchProductsAsync(string searchTerm, int page, int pageSize)
    {
        string cacheKey = $"Search_{searchTerm?.ToLower() ?? "all"}_Page_{page}_Size_{pageSize}";

        if (_cache.TryGetValue(cacheKey, out PagedResult<ProductDto>? cachedResult) && cachedResult != null)
        {
            return cachedResult;
        }

        page = Math.Max(1, page);
        pageSize = Math.Max(1, pageSize);

        var query = from p in _context.Products
                    join u in _context.Users on p.VendorId equals u.Id into vendorGroup
                    from u in vendorGroup.DefaultIfEmpty()
                    where p.IsActive
                    select new { p, VendorName = u != null ? u.Username : "بائع" };

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.ToLower();
            query = query.Where(x =>
                x.p.Name.ToLower().Contains(term) ||
                x.p.NameAr.ToLower().Contains(term) ||
                x.p.NameEn.ToLower().Contains(term) ||
                x.p.Description.ToLower().Contains(term) ||
                x.p.DescriptionAr.ToLower().Contains(term) ||
                x.p.DescriptionEn.ToLower().Contains(term));
        }

        var totalCount = await query.CountAsync();

        var products = await query
            .OrderBy(x => x.p.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new ProductDto
            {
                Id = x.p.Id,
                Name = !string.IsNullOrEmpty(x.p.Name) ? x.p.Name : (x.p.NameAr ?? x.p.NameEn ?? string.Empty),
                Description = !string.IsNullOrEmpty(x.p.Description) ? x.p.Description : (x.p.DescriptionAr ?? x.p.DescriptionEn ?? string.Empty),
                NameAr = x.p.NameAr,
                NameEn = x.p.NameEn,
                DescriptionAr = x.p.DescriptionAr,
                DescriptionEn = x.p.DescriptionEn,
                Price = x.p.Price,
                StockQuantity = x.p.StockQuantity,
                ImageUrl = x.p.ImageUrl,
                VendorName = x.VendorName,
                Rating = x.p.Rating,
                IsActive = x.p.IsActive,
                Category = x.p.Category
            })
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
    // FILTER PRODUCTS
    // ============================================================
    public async Task<PagedResult<ProductDto>> GetProductsFilteredAsync(
        string? searchTerm,
        decimal? minPrice,
        decimal? maxPrice,
        int? vendorId,
        bool? inStock,
        double? rating,
        int page,
        int pageSize)
    {
        string cacheKey = $"Filter_{searchTerm ?? "all"}_{minPrice}_{maxPrice}_{vendorId}_{inStock}_{rating}_P{page}_S{pageSize}";

        if (_cache.TryGetValue(cacheKey, out PagedResult<ProductDto>? cachedResult) && cachedResult != null)
        {
            return cachedResult;
        }

        page = Math.Max(1, page);
        pageSize = Math.Max(1, pageSize);

        var query = from p in _context.Products
                    join u in _context.Users on p.VendorId equals u.Id into vendorGroup
                    from u in vendorGroup.DefaultIfEmpty()
                    where p.IsActive
                    select new { p, VendorName = u != null ? u.Username : "بائع" };

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.ToLower();
            query = query.Where(x =>
                x.p.Name.ToLower().Contains(term) ||
                x.p.NameAr.ToLower().Contains(term) ||
                x.p.NameEn.ToLower().Contains(term) ||
                x.p.Description.ToLower().Contains(term) ||
                x.p.DescriptionAr.ToLower().Contains(term) ||
                x.p.DescriptionEn.ToLower().Contains(term));
        }

        if (minPrice.HasValue)
            query = query.Where(x => x.p.Price >= minPrice.Value);

        if (maxPrice.HasValue)
            query = query.Where(x => x.p.Price <= maxPrice.Value);

        if (vendorId.HasValue)
            query = query.Where(x => x.p.VendorId == vendorId.Value);

        if (inStock.HasValue && inStock.Value)
            query = query.Where(x => x.p.StockQuantity > 0);

        if (rating.HasValue && rating.Value > 0)
            query = query.Where(x => x.p.Rating >= rating.Value);

        var totalCount = await query.CountAsync();

        var products = await query
            .OrderBy(x => x.p.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new ProductDto
            {
                Id = x.p.Id,
                Name = !string.IsNullOrEmpty(x.p.Name) ? x.p.Name : (x.p.NameAr ?? x.p.NameEn ?? string.Empty),
                Description = !string.IsNullOrEmpty(x.p.Description) ? x.p.Description : (x.p.DescriptionAr ?? x.p.DescriptionEn ?? string.Empty),
                NameAr = x.p.NameAr,
                NameEn = x.p.NameEn,
                DescriptionAr = x.p.DescriptionAr,
                DescriptionEn = x.p.DescriptionEn,
                Price = x.p.Price,
                StockQuantity = x.p.StockQuantity,
                ImageUrl = x.p.ImageUrl,
                VendorName = x.VendorName,
                Rating = x.p.Rating,
                IsActive = x.p.IsActive,
                Category = x.p.Category
            })
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
    // GET PRODUCT BY ID
    // ============================================================
    public async Task<ProductDto> GetProductByIdAsync(int id)
    {
        var product = await (from p in _context.Products
                             join u in _context.Users on p.VendorId equals u.Id into vendorGroup
                             from u in vendorGroup.DefaultIfEmpty()
                             where p.Id == id && p.IsActive
                             select new ProductDto
                             {
                                 Id = p.Id,
                                 Name = !string.IsNullOrEmpty(p.Name) ? p.Name : (p.NameAr ?? p.NameEn ?? string.Empty),
                                 Description = !string.IsNullOrEmpty(p.Description) ? p.Description : (p.DescriptionAr ?? p.DescriptionEn ?? string.Empty),
                                 NameAr = p.NameAr,
                                 NameEn = p.NameEn,
                                 DescriptionAr = p.DescriptionAr,
                                 DescriptionEn = p.DescriptionEn,
                                 Price = p.Price,
                                 StockQuantity = p.StockQuantity,
                                 ImageUrl = p.ImageUrl,
                                 VendorName = u != null ? u.Username : "بائع",
                                 Rating = p.Rating,
                                 IsActive = p.IsActive,
                                 Category = p.Category
                             }).FirstOrDefaultAsync();

        if (product == null)
            throw new Exception("Product not found.");

        return product;
    }

    // ============================================================
    // GET PRODUCTS BY CATEGORY
    // ============================================================
    public async Task<PagedResult<ProductDto>> GetProductsByCategoryAsync(string categoryName, int page, int pageSize)
    {
        string cacheKey = $"Category_{categoryName}_Page_{page}_Size_{pageSize}";

        if (_cache.TryGetValue(cacheKey, out PagedResult<ProductDto>? cachedResult) && cachedResult != null)
        {
            return cachedResult;
        }

        page = Math.Max(1, page);
        pageSize = Math.Max(1, pageSize);

        var query = from p in _context.Products
                    join u in _context.Users on p.VendorId equals u.Id into vendorGroup
                    from u in vendorGroup.DefaultIfEmpty()
                    where p.IsActive && p.Category == categoryName
                    select new { p, VendorName = u != null ? u.Username : "بائع" };

        var totalCount = await query.CountAsync();

        var products = await query
            .OrderBy(x => x.p.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new ProductDto
            {
                Id = x.p.Id,
                Name = !string.IsNullOrEmpty(x.p.Name) ? x.p.Name : (x.p.NameAr ?? x.p.NameEn ?? string.Empty),
                Description = !string.IsNullOrEmpty(x.p.Description) ? x.p.Description : (x.p.DescriptionAr ?? x.p.DescriptionEn ?? string.Empty),
                NameAr = x.p.NameAr,
                NameEn = x.p.NameEn,
                DescriptionAr = x.p.DescriptionAr,
                DescriptionEn = x.p.DescriptionEn,
                Price = x.p.Price,
                StockQuantity = x.p.StockQuantity,
                ImageUrl = x.p.ImageUrl,
                VendorName = x.VendorName,
                Rating = x.p.Rating,
                IsActive = x.p.IsActive,
                Category = x.p.Category
            })
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
    // VENDOR PRODUCTS
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

        var query = from p in _context.Products
                    join u in _context.Users on p.VendorId equals u.Id into vendorGroup
                    from u in vendorGroup.DefaultIfEmpty()
                    where p.IsActive && p.VendorId == vendorId
                    select new { p, VendorName = u != null ? u.Username : "بائع" };

        var totalCount = await query.CountAsync();

        var products = await query
            .OrderBy(x => x.p.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new ProductDto
            {
                Id = x.p.Id,
                Name = !string.IsNullOrEmpty(x.p.Name) ? x.p.Name : (x.p.NameAr ?? x.p.NameEn ?? string.Empty),
                Description = !string.IsNullOrEmpty(x.p.Description) ? x.p.Description : (x.p.DescriptionAr ?? x.p.DescriptionEn ?? string.Empty),
                NameAr = x.p.NameAr,
                NameEn = x.p.NameEn,
                DescriptionAr = x.p.DescriptionAr,
                DescriptionEn = x.p.DescriptionEn,
                Price = x.p.Price,
                StockQuantity = x.p.StockQuantity,
                ImageUrl = x.p.ImageUrl,
                VendorName = x.VendorName,
                Rating = x.p.Rating,
                IsActive = x.p.IsActive,
                Category = x.p.Category
            })
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
    // CREATE, UPDATE, DELETE
    // ============================================================
    public async Task<ProductDto> CreateProductAsync(Product product, int vendorId)
    {
        product.VendorId = vendorId;
        product.CreatedAt = DateTime.UtcNow;
        product.IsActive = true;

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        ClearProductCaches(vendorId);

        var vendor = await _context.Users.FindAsync(vendorId);
        return MapToDto(product, vendor?.Username);
    }

    public async Task<ProductDto> UpdateProductAsync(Product product, int vendorId)
    {
        var existing = await _context.Products
            .FirstOrDefaultAsync(p => p.Id == product.Id && p.VendorId == vendorId);

        if (existing == null)
            throw new Exception("Product not found or you do not have permission to edit it.");

        // Update all fields
        existing.NameAr = product.NameAr;
        existing.NameEn = product.NameEn;
        existing.DescriptionAr = product.DescriptionAr;
        existing.DescriptionEn = product.DescriptionEn;
        existing.Name = product.Name; // keep main fields
        existing.Description = product.Description;
        existing.Price = product.Price;
        existing.CostPrice = product.CostPrice;
        existing.StockQuantity = product.StockQuantity;
        existing.IsActive = product.IsActive;
        existing.Rating = product.Rating;
        existing.Category = product.Category;

        if (!string.IsNullOrEmpty(product.ImageUrl))
            existing.ImageUrl = product.ImageUrl;

        await _context.SaveChangesAsync();

        ClearProductCaches(vendorId);

        var vendor = await _context.Users.FindAsync(vendorId);
        return MapToDto(existing, vendor?.Username);
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
}