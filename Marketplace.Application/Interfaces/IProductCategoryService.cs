using Marketplace.Application.DTOs;

namespace Marketplace.Application.Interfaces;

public interface IProductCategoryService
{
    Task<List<ProductCategoryDto>> GetAllAsync(bool onlyActive = false);
    Task<ProductCategoryDto> GetByIdAsync(int id);
    Task<ProductCategoryDto> CreateAsync(CreateProductCategoryDto dto);
    Task<ProductCategoryDto> UpdateAsync(int id, UpdateProductCategoryDto dto);
    Task DeleteAsync(int id);
}