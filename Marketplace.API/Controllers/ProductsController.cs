using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Marketplace.Application.DTOs;
using Marketplace.Application.Interfaces;
using Marketplace.Domain.Entities;

namespace Marketplace.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    // ============================================================
    // PUBLIC ENDPOINTS (No auth)
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

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string q, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        if (string.IsNullOrWhiteSpace(q))
        {
            var all = await _productService.GetProductsAsync(page, pageSize);
            return Ok(all);
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
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var result = await _productService.GetProductsFilteredAsync(
            q, minPrice, maxPrice, vendorId, inStock, page, pageSize);
        return Ok(result);
    }

    // ============================================================
    // VENDOR ENDPOINTS (Auth required)
    // ============================================================

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromForm] ProductCreateDto productDto, IFormFile? image)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var vendorIdClaim = User.FindFirst("VendorId") ?? User.FindFirst(ClaimTypes.NameIdentifier);
        if (vendorIdClaim == null)
            return Unauthorized("User not authenticated properly.");

        var vendorId = int.Parse(vendorIdClaim.Value);

        // Handle image upload
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
            Name = productDto.Name,
            Description = productDto.Description,
            Price = productDto.Price,
            CostPrice = productDto.CostPrice, // NEW
            StockQuantity = productDto.StockQuantity,
            VendorId = vendorId,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            ImageUrl = imageUrl
        };

        var createdProduct = await _productService.CreateProductAsync(product, vendorId);
        return CreatedAtAction(nameof(GetAll), new { id = createdProduct.Id }, createdProduct);
    }

    [HttpGet("vendors/products")]
    [Authorize]
    public async Task<IActionResult> GetMyProducts([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var vendorIdClaim = User.FindFirst("VendorId") ?? User.FindFirst(ClaimTypes.NameIdentifier);
        if (vendorIdClaim == null)
            return Unauthorized();

        var vendorId = int.Parse(vendorIdClaim.Value);
        var result = await _productService.GetVendorProductsAsync(vendorId, page, pageSize);
        return Ok(result);
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> Update(int id, [FromForm] ProductUpdateDto productDto, IFormFile? image)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var vendorIdClaim = User.FindFirst("VendorId") ?? User.FindFirst(ClaimTypes.NameIdentifier);
        if (vendorIdClaim == null)
            return Unauthorized();

        var vendorId = int.Parse(vendorIdClaim.Value);

        // Handle new image upload if provided
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
            Name = productDto.Name,
            Description = productDto.Description,
            Price = productDto.Price,
            CostPrice = productDto.CostPrice,
            StockQuantity = productDto.StockQuantity,
            IsActive = productDto.IsActive,
            ImageUrl = newImageUrl ?? productDto.ExistingImageUrl // Keep old if no new image
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
    [Authorize]
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