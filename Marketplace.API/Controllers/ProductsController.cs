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
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;
    private readonly AppDbContext _context;

    public ProductsController(IProductService productService, AppDbContext context)
    {
        _productService = productService;
        _context = context;
    }

    private int GetUserId()
    {
        var claim = User.FindFirst("VendorId") ?? User.FindFirst(ClaimTypes.NameIdentifier);
        return int.Parse(claim!.Value);
    }

    // ============================================================
    // PUBLIC ENDPOINTS
    // ============================================================

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var result = await _productService.GetProductsAsync(page, pageSize);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var product = await _productService.GetProductByIdAsync(id);
            return Ok(product);
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpGet("category/{categoryName}")]
    public async Task<IActionResult> GetByCategory(string categoryName, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var result = await _productService.GetProductsByCategoryAsync(categoryName, page, pageSize);
        return Ok(result);
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string q, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        if (string.IsNullOrWhiteSpace(q))
        {
            var allProducts = await _productService.GetProductsAsync(page, pageSize);
            return Ok(allProducts);
        }

        var result = await _productService.SearchProductsAsync(q, page, pageSize);
        return Ok(result);
    }

    [HttpGet("filter")]
    public async Task<IActionResult> GetFiltered(
        [FromQuery] string? q,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        [FromQuery] int? vendorId,
        [FromQuery] bool? inStock,
        [FromQuery] double? rating,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var result = await _productService.GetProductsFilteredAsync(
            q, minPrice, maxPrice, vendorId, inStock, rating, page, pageSize);
        return Ok(result);
    }

    // ============================================================
    // RATING ENDPOINTS (NEW)
    // ============================================================

    [HttpPost("{id}/rate")]
    [Authorize]
    public async Task<IActionResult> RateProduct(int id, [FromBody] ProductRatingDto ratingDto)
    {
        if (ratingDto.Rating < 1 || ratingDto.Rating > 5)
            return BadRequest(new { message = "Rating must be between 1 and 5." });

        var userId = GetUserId();

        var product = await _context.Products.FindAsync(id);
        if (product == null)
            return NotFound(new { message = "Product not found." });

        var existing = await _context.ProductReviews
            .FirstOrDefaultAsync(r => r.ProductId == id && r.UserId == userId);

        if (existing != null)
        {
            existing.Rating = ratingDto.Rating;
            existing.Review = ratingDto.Review;
            existing.CreatedAt = DateTime.UtcNow;
        }
        else
        {
            var review = new ProductReview
            {
                ProductId = id,
                UserId = userId,
                Rating = ratingDto.Rating,
                Review = ratingDto.Review,
                CreatedAt = DateTime.UtcNow
            };
            _context.ProductReviews.Add(review);
        }

        await _context.SaveChangesAsync();

        // Recalculate average rating
        var avg = await _context.ProductReviews
            .Where(r => r.ProductId == id)
            .AverageAsync(r => (double)r.Rating);

        product.Rating = avg;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Rating submitted successfully.", averageRating = avg });
    }

    [HttpGet("{id}/reviews")]
    public async Task<IActionResult> GetReviews(int id)
    {
        var reviews = await _context.ProductReviews
            .Where(r => r.ProductId == id)
            .Include(r => r.User)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new ProductReviewResponseDto
            {
                Id = r.Id,
                UserId = r.UserId,
                UserName = r.User != null ? r.User.Username : "Unknown",
                Rating = r.Rating,
                Review = r.Review,
                CreatedAt = r.CreatedAt
            })
            .ToListAsync();

        return Ok(reviews);
    }

    // ============================================================
    // ADMIN / VENDOR ENDPOINTS (unchanged, keep your existing code)
    // ============================================================

    [HttpGet("admin/all")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllProductsForAdmin(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50)
    {
        var query = from p in _context.Products
                    join u in _context.Users on p.VendorId equals u.Id into vendorGroup
                    from u in vendorGroup.DefaultIfEmpty()
                    select new ProductDto
                    {
                        Id = p.Id,
                        NameAr = p.NameAr,
                        NameEn = p.NameEn,
                        DescriptionAr = p.DescriptionAr,
                        DescriptionEn = p.DescriptionEn,
                        Price = p.Price,
                        StockQuantity = p.StockQuantity,
                        ImageUrl = p.ImageUrl,
                        VendorName = u != null ? u.Username : "بائع",
                        IsActive = p.IsActive,
                        Rating = p.Rating,
                        Category = p.Category
                    };

        var totalCount = await query.CountAsync();
        var products = await query
            .OrderByDescending(p => p.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new PagedResult<ProductDto>
        {
            Items = products,
            TotalCount = totalCount,
            PageNumber = page,
            PageSize = pageSize
        });
    }

    [HttpGet("vendors/products")]
    [Authorize(Roles = "Vendor,Admin")]
    public async Task<IActionResult> GetMyProducts([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var vendorIdClaim = User.FindFirst("VendorId") ?? User.FindFirst(ClaimTypes.NameIdentifier);
        if (vendorIdClaim == null)
            return Unauthorized();

        var vendorId = int.Parse(vendorIdClaim.Value);
        var result = await _productService.GetVendorProductsAsync(vendorId, page, pageSize);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Vendor,Admin")]
    public async Task<IActionResult> Create([FromForm] ProductCreateDto productDto, IFormFile? image)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var vendorIdClaim = User.FindFirst("VendorId") ?? User.FindFirst(ClaimTypes.NameIdentifier);
        if (vendorIdClaim == null)
            return Unauthorized();

        var vendorId = int.Parse(vendorIdClaim.Value);

        string? imageUrl = null;
        if (image != null && image.Length > 0)
        {
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "products");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(image.FileName)}";
            var filePath = Path.Combine(uploadsFolder, fileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }
            imageUrl = $"/images/products/{fileName}";
        }

        var product = new Product
        {
            NameAr = productDto.NameAr,
            NameEn = productDto.NameEn,
            DescriptionAr = productDto.DescriptionAr,
            DescriptionEn = productDto.DescriptionEn,
            Name = productDto.NameAr,
            Description = productDto.DescriptionAr,
            Price = productDto.Price,
            CostPrice = productDto.CostPrice,
            StockQuantity = productDto.StockQuantity,
            VendorId = vendorId,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            ImageUrl = imageUrl,
            Rating = null,
            Category = productDto.Category
        };

        var createdProduct = await _productService.CreateProductAsync(product, vendorId);
        return CreatedAtAction(nameof(GetAll), new { id = createdProduct.Id }, createdProduct);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Vendor,Admin")]
    public async Task<IActionResult> Update(int id, [FromForm] ProductUpdateDto productDto, IFormFile? image)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var isAdmin = User.IsInRole("Admin");
        int vendorId;

        if (isAdmin)
        {
            var existingProduct = await _context.Products.FindAsync(id);
            if (existingProduct == null)
                return NotFound(new { message = "Product not found." });
            vendorId = existingProduct.VendorId;
        }
        else
        {
            var vendorIdClaim = User.FindFirst("VendorId") ?? User.FindFirst(ClaimTypes.NameIdentifier);
            if (vendorIdClaim == null)
                return Unauthorized();
            vendorId = int.Parse(vendorIdClaim.Value);
        }

        string? newImageUrl = null;
        if (image != null && image.Length > 0)
        {
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "products");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(image.FileName)}";
            var filePath = Path.Combine(uploadsFolder, fileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }
            newImageUrl = $"/images/products/{fileName}";
        }

        var product = new Product
        {
            Id = id,
            NameAr = productDto.NameAr,
            NameEn = productDto.NameEn,
            DescriptionAr = productDto.DescriptionAr,
            DescriptionEn = productDto.DescriptionEn,
            Name = productDto.NameAr,
            Description = productDto.DescriptionAr,
            Price = productDto.Price,
            CostPrice = productDto.CostPrice,
            StockQuantity = productDto.StockQuantity,
            IsActive = productDto.IsActive,
            ImageUrl = newImageUrl ?? productDto.ExistingImageUrl,
            Rating = null,
            Category = productDto.Category
        };

        try
        {
            var updated = await _productService.UpdateProductAsync(product, vendorId);
            return Ok(updated);
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Vendor,Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var vendorIdClaim = User.FindFirst("VendorId") ?? User.FindFirst(ClaimTypes.NameIdentifier);
        if (vendorIdClaim == null)
            return Unauthorized();

        var vendorId = int.Parse(vendorIdClaim.Value);

        var result = await _productService.DeleteProductAsync(id, vendorId);
        if (!result)
            return NotFound(new { message = "Product not found or you don't have permission." });

        return NoContent();
    }
}