using Marketplace.Application.DTOs;
using Marketplace.Domain.Entities;

namespace Marketplace.Application.Interfaces;

public interface IProductService
{
    // Public endpoints
    Task<PagedResult<ProductDto>> GetProductsAsync(int page, int pageSize);
    Task<PagedResult<ProductDto>> SearchProductsAsync(string searchTerm, int page, int pageSize);
    Task<PagedResult<ProductDto>> GetProductsFilteredAsync(
        string? searchTerm,
        decimal? minPrice,
        decimal? maxPrice,
        int? vendorId,
        bool? inStock,
        double? rating, // NEW: Filter by minimum rating
        int page,
        int pageSize);
    Task<ProductDto> GetProductByIdAsync(int id);
    Task<PagedResult<ProductDto>> GetProductsByCategoryAsync(string categoryName, int page, int pageSize);

    // Vendor endpoints
    Task<PagedResult<ProductDto>> GetVendorProductsAsync(int vendorId, int page, int pageSize);
    Task<ProductDto> CreateProductAsync(Product product, int vendorId);
    Task<ProductDto> UpdateProductAsync(Product product, int vendorId);
    Task<bool> DeleteProductAsync(int productId, int vendorId);
}