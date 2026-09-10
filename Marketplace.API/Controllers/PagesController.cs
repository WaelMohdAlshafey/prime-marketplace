using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Marketplace.Domain.Entities;
using Marketplace.Infrastructure.Data;

namespace Marketplace.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PagesController : ControllerBase
{
    private readonly AppDbContext _context;

    public PagesController(AppDbContext context)
    {
        _context = context;
    }

    private int GetUserId()
    {
        var claim = User.FindFirst("VendorId") ?? User.FindFirst(ClaimTypes.NameIdentifier);
        return claim != null ? int.Parse(claim.Value) : 0;
    }

    [HttpGet]
    public async Task<IActionResult> GetPages()
    {
        var pages = await _context.Pages
            .Where(p => p.IsPublished)
            .OrderBy(p => p.DisplayOrder ?? 999)
            .ThenBy(p => p.Title)
            .Select(p => new
            {
                p.Id,
                p.Title,
                p.Slug,
                p.Content,
                p.MetaDescription,
                p.MetaKeywords,
                p.IsPublished,
                p.ShowInFooter,
                p.ShowInNavbar,
                p.DisplayOrder,
                p.PageClassId,
                p.CssClass,
                p.CreatedAt,
                p.UpdatedAt
            })
            .ToListAsync();
        return Ok(pages);
    }

    [HttpGet("slug/{slug}")]
    public async Task<IActionResult> GetPageBySlug(string slug)
    {
        var page = await _context.Pages
            .FirstOrDefaultAsync(p => p.Slug == slug && p.IsPublished);

        if (page == null)
            return NotFound(new { message = "Page not found." });

        return Ok(new
        {
            page.Id,
            page.Title,
            page.Slug,
            page.Content,
            page.MetaDescription,
            page.MetaKeywords,
            page.IsPublished,
            page.ShowInFooter,
            page.ShowInNavbar,
            page.DisplayOrder,
            page.PageClassId,
            page.CssClass,
            page.CreatedAt,
            page.UpdatedAt
        });
    }

    [HttpGet("navigation")]
    public async Task<IActionResult> GetNavigation()
    {
        var navbarPages = await _context.Pages
            .Where(p => p.IsPublished && p.ShowInNavbar)
            .OrderBy(p => p.DisplayOrder ?? 999)
            .Select(p => new { p.Id, p.Title, p.Slug })
            .ToListAsync();

        var footerPages = await _context.Pages
            .Where(p => p.IsPublished && p.ShowInFooter)
            .OrderBy(p => p.DisplayOrder ?? 999)
            .Select(p => new { p.Id, p.Title, p.Slug })
            .ToListAsync();

        return Ok(new { navbarPages, footerPages });
    }

    [HttpGet("admin/all")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllAdmin()
    {
        var pages = await _context.Pages
            .OrderBy(p => p.DisplayOrder ?? 999)
            .ThenBy(p => p.Title)
            .Select(p => new
            {
                p.Id,
                p.Title,
                p.Slug,
                p.Content,
                p.MetaDescription,
                p.MetaKeywords,
                p.IsPublished,
                p.ShowInFooter,
                p.ShowInNavbar,
                p.DisplayOrder,
                p.PageClassId,
                p.CssClass,
                p.CreatedAt,
                p.UpdatedAt
            })
            .ToListAsync();
        return Ok(pages);
    }

    [HttpGet("admin/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetById(int id)
    {
        var page = await _context.Pages.FindAsync(id);
        if (page == null) return NotFound(new { message = "Page not found." });
        return Ok(page);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreatePageDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        if (await _context.Pages.AnyAsync(p => p.Slug == dto.Slug))
            return BadRequest(new { message = "A page with this slug already exists." });

        var userId = GetUserId();

        var page = new Page
        {
            Title = dto.Title,
            Slug = dto.Slug,
            Content = dto.Content,
            MetaDescription = dto.MetaDescription,
            MetaKeywords = dto.MetaKeywords,
            IsPublished = dto.IsPublished,
            ShowInFooter = dto.ShowInFooter,
            ShowInNavbar = dto.ShowInNavbar,
            DisplayOrder = dto.DisplayOrder,
            PageClassId = dto.PageClassId,
            CssClass = dto.CssClass,
            CreatedAt = DateTime.UtcNow,
            CreatedByUserId = userId > 0 ? userId : null
        };

        _context.Pages.Add(page);
        await _context.SaveChangesAsync();
        return Ok(page);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdatePageDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var page = await _context.Pages.FindAsync(id);
        if (page == null) return NotFound(new { message = "Page not found." });

        if (await _context.Pages.AnyAsync(p => p.Slug == dto.Slug && p.Id != id))
            return BadRequest(new { message = "A page with this slug already exists." });

        var userId = GetUserId();

        page.Title = dto.Title;
        page.Slug = dto.Slug;
        page.Content = dto.Content;
        page.MetaDescription = dto.MetaDescription;
        page.MetaKeywords = dto.MetaKeywords;
        page.IsPublished = dto.IsPublished;
        page.ShowInFooter = dto.ShowInFooter;
        page.ShowInNavbar = dto.ShowInNavbar;
        page.DisplayOrder = dto.DisplayOrder;
        page.PageClassId = dto.PageClassId;
        page.CssClass = dto.CssClass;
        page.UpdatedAt = DateTime.UtcNow;
        page.UpdatedByUserId = userId > 0 ? userId : null;

        await _context.SaveChangesAsync();
        return Ok(page);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var page = await _context.Pages.FindAsync(id);
        if (page == null) return NotFound(new { message = "Page not found." });

        _context.Pages.Remove(page);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}

public class CreatePageDto
{
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Content { get; set; }
    public string? MetaDescription { get; set; }
    public string? MetaKeywords { get; set; }
    public bool IsPublished { get; set; } = true;
    public bool ShowInFooter { get; set; }
    public bool ShowInNavbar { get; set; }
    public int? DisplayOrder { get; set; }
    public int? PageClassId { get; set; }
    public string? CssClass { get; set; }
}

public class UpdatePageDto
{
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Content { get; set; }
    public string? MetaDescription { get; set; }
    public string? MetaKeywords { get; set; }
    public bool IsPublished { get; set; } = true;
    public bool ShowInFooter { get; set; }
    public bool ShowInNavbar { get; set; }
    public int? DisplayOrder { get; set; }
    public int? PageClassId { get; set; }
    public string? CssClass { get; set; }
}