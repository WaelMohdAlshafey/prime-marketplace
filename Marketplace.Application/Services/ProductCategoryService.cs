using Microsoft.EntityFrameworkCore;
using Marketplace.Application.DTOs;
using Marketplace.Application.Interfaces;
using Marketplace.Domain.Entities;
using Marketplace.Infrastructure.Data;

namespace Marketplace.Application.Services;

public class ProductCategoryService : IProductCategoryService
{
    private readonly AppDbContext _context;

    public ProductCategoryService(AppDbContext context) { _context = context; }

    public async Task<List<ProductCategoryDto>> GetAllAsync(bool onlyActive = false)
    {
        var q = _context.ProductCategories.AsQueryable();
        if (onlyActive) q = q.Where(c => c.IsActive);

        return await q
            .OrderBy(c => c.DisplayOrder ?? 999)
            .ThenBy(c => c.Name)
            .Select(c => new ProductCategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Slug = c.Slug,
                Description = c.Description,
                Icon = c.Icon,
                ColorClass = c.ColorClass,
                DisplayOrder = c.DisplayOrder,
                IsActive = c.IsActive,
                ProductCount = _context.Products.Count(p => p.Category == c.Name && p.IsActive)
            })
            .ToListAsync();
    }

    public async Task<ProductCategoryDto> GetByIdAsync(int id)
    {
        var c = await _context.ProductCategories.FindAsync(id);
        if (c == null) throw new Exception("Category not found.");
        return new ProductCategoryDto
        {
            Id = c.Id,
            Name = c.Name,
            Slug = c.Slug,
            Description = c.Description,
            Icon = c.Icon,
            ColorClass = c.ColorClass,
            DisplayOrder = c.DisplayOrder,
            IsActive = c.IsActive
        };
    }

    public async Task<ProductCategoryDto> CreateAsync(CreateProductCategoryDto dto)
    {
        if (await _context.ProductCategories.AnyAsync(c => c.Slug == dto.Slug))
            throw new Exception("A category with this slug already exists.");

        var c = new ProductCategory
        {
            Name = dto.Name,
            Slug = dto.Slug,
            Description = dto.Description,
            Icon = dto.Icon,
            ColorClass = dto.ColorClass,
            DisplayOrder = dto.DisplayOrder,
            IsActive = dto.IsActive
        };
        _context.ProductCategories.Add(c);
        await _context.SaveChangesAsync();
        return await GetByIdAsync(c.Id);
    }

    public async Task<ProductCategoryDto> UpdateAsync(int id, UpdateProductCategoryDto dto)
    {
        var c = await _context.ProductCategories.FindAsync(id);
        if (c == null) throw new Exception("Category not found.");

        if (await _context.ProductCategories.AnyAsync(x => x.Slug == dto.Slug && x.Id != id))
            throw new Exception("A category with this slug already exists.");

        c.Name = dto.Name;
        c.Slug = dto.Slug;
        c.Description = dto.Description;
        c.Icon = dto.Icon;
        c.ColorClass = dto.ColorClass;
        c.DisplayOrder = dto.DisplayOrder;
        c.IsActive = dto.IsActive;

        await _context.SaveChangesAsync();
        return await GetByIdAsync(c.Id);
    }

    public async Task DeleteAsync(int id)
    {
        var c = await _context.ProductCategories.FindAsync(id);
        if (c == null) throw new Exception("Category not found.");
        _context.ProductCategories.Remove(c);
        await _context.SaveChangesAsync();
    }
}