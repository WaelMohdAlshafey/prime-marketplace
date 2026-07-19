using Marketplace.Application.DTOs;
using Marketplace.Domain.Entities; // <-- CRUCIAL: Required for Product type

namespace Marketplace.Application.Interfaces;

public interface IProductService
{
    // ============================================================
    // PUBLIC ENDPOINTS (No authentication required)
    // ============================================================
    Task<PagedResult<ProductDto>> GetProductsAsync(int page, int pageSize);
    Task<PagedResult<ProductDto>> SearchProductsAsync(string searchTerm, int page, int pageSize);
    Task<PagedResult<ProductDto>> GetProductsFilteredAsync(
        string? searchTerm,
        decimal? minPrice,
        decimal? maxPrice,
        int? vendorId,
        bool? inStock,
        int page,
        int pageSize);
    Task<ProductDto> GetProductByIdAsync(int id);

    // ============================================================
    // VENDOR ENDPOINTS (Authentication required)
    // ============================================================
    Task<PagedResult<ProductDto>> GetVendorProductsAsync(int vendorId, int page, int pageSize);

    // ============================================================
    // CREATE / UPDATE / DELETE (Using Product entity directly)
    // ============================================================
    Task<ProductDto> CreateProductAsync(Product product, int vendorId);
    Task<ProductDto> UpdateProductAsync(Product product, int vendorId);
    Task<bool> DeleteProductAsync(int productId, int vendorId);
}