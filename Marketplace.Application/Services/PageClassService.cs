using Microsoft.EntityFrameworkCore;
using Marketplace.Application.DTOs;
using Marketplace.Application.Interfaces;
using Marketplace.Domain.Entities;
using Marketplace.Infrastructure.Data;

namespace Marketplace.Application.Services;

public class PageClassService : IPageClassService
{
    private readonly AppDbContext _context;

    public PageClassService(AppDbContext context) { _context = context; }

    public async Task<List<PageClassDto>> GetAllAsync(bool onlyActive = false)
    {
        var q = _context.PageClasses.AsQueryable();
        if (onlyActive) q = q.Where(c => c.IsActive);

        return await q
            .OrderBy(c => c.DisplayOrder ?? 999)
            .ThenBy(c => c.Name)
            .Select(c => new PageClassDto
            {
                Id = c.Id,
                Name = c.Name,
                Slug = c.Slug,
                Description = c.Description,
                Icon = c.Icon,
                ColorClass = c.ColorClass,
                DisplayOrder = c.DisplayOrder,
                IsActive = c.IsActive,
                PageCount = _context.Pages.Count(p => p.PageClassId == c.Id)
            })
            .ToListAsync();
    }

    public async Task<PageClassDto> GetByIdAsync(int id)
    {
        var c = await _context.PageClasses.FindAsync(id);
        if (c == null) throw new Exception("Page class not found.");
        return new PageClassDto
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

    public async Task<PageClassDto> CreateAsync(CreatePageClassDto dto)
    {
        if (await _context.PageClasses.AnyAsync(c => c.Slug == dto.Slug))
            throw new Exception("A page class with this slug already exists.");

        var c = new PageClass
        {
            Name = dto.Name,
            Slug = dto.Slug,
            Description = dto.Description,
            Icon = dto.Icon,
            ColorClass = dto.ColorClass,
            DisplayOrder = dto.DisplayOrder,
            IsActive = dto.IsActive
        };

        _context.PageClasses.Add(c);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(c.Id);
    }

    public async Task<PageClassDto> UpdateAsync(int id, UpdatePageClassDto dto)
    {
        var c = await _context.PageClasses.FindAsync(id);
        if (c == null) throw new Exception("Page class not found.");

        if (await _context.PageClasses.AnyAsync(x => x.Slug == dto.Slug && x.Id != id))
            throw new Exception("A page class with this slug already exists.");

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
        var c = await _context.PageClasses.FindAsync(id);
        if (c == null) throw new Exception("Page class not found.");

        _context.PageClasses.Remove(c);
        await _context.SaveChangesAsync();
    }
}