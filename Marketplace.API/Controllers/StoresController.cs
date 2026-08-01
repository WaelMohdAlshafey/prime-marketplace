using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Marketplace.Application.DTOs;
using Marketplace.Application.Interfaces;
using Marketplace.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.API.Controllers
{
    [ApiController]
    [Route("api/stores")]
    public class StoresController : ControllerBase
    {
        private readonly IStoreService _storeService;
        private readonly AppDbContext _context;

        public StoresController(IStoreService storeService, AppDbContext context)
        {
            _storeService = storeService;
            _context = context;
        }

        // ============================================================
        // PUBLIC – Get all stores (active only)
        // ============================================================
        [HttpGet]
        public async Task<IActionResult> GetStores([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            try
            {
                var query = _context.Stores
                    .Where(s => s.IsActive)
                    .OrderBy(s => s.Name);

                var totalCount = await query.CountAsync();

                var stores = await query
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(s => new StoreResponseDto
                    {
                        Id = s.Id,
                        Name = s.Name,
                        LogoUrl = s.LogoUrl,
                        Description = s.Description,
                        VendorId = s.VendorId,
                        VendorUsername = "Unknown",
                        IsActive = s.IsActive,
                        CreatedAt = s.CreatedAt,
                        ProductCount = _context.Products.Count(p => p.VendorId == s.VendorId && p.IsActive)
                    })
                    .ToListAsync();

                var result = new PagedResult<StoreResponseDto>
                {
                    Items = stores,
                    TotalCount = totalCount,
                    PageNumber = page,
                    PageSize = pageSize
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ GetStores ERROR: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
                return StatusCode(500, new { message = ex.Message, stackTrace = ex.StackTrace });
            }
        }

        // ============================================================
        // PUBLIC – Get a single store by ID
        // ============================================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetStore(int id)
        {
            try
            {
                var store = await _context.Stores
                    .Where(s => s.Id == id && s.IsActive)
                    .Select(s => new StoreResponseDto
                    {
                        Id = s.Id,
                        Name = s.Name,
                        LogoUrl = s.LogoUrl,
                        Description = s.Description,
                        VendorId = s.VendorId,
                        VendorUsername = "Unknown",
                        IsActive = s.IsActive,
                        CreatedAt = s.CreatedAt,
                        ProductCount = _context.Products.Count(p => p.VendorId == s.VendorId && p.IsActive)
                    })
                    .FirstOrDefaultAsync();

                if (store == null)
                    return NotFound(new { message = "Store not found." });

                return Ok(store);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ GetStore({id}) ERROR: {ex.Message}");
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // ============================================================
        // PUBLIC – Get products of a store
        // ============================================================
        [HttpGet("{id}/products")]
        public async Task<IActionResult> GetStoreProducts(int id, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            try
            {
                var store = await _context.Stores.FindAsync(id);
                if (store == null)
                    return NotFound(new { message = "Store not found." });

                var result = await _storeService.GetStoreProductsAsync(id, page, pageSize);
                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ GetStoreProducts({id}) ERROR: {ex.Message}");
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // ============================================================
        // ADMIN ONLY – Create a store (with logo upload)
        // ============================================================
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateStore([FromForm] StoreCreateDto dto, IFormFile? logo)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                string? logoUrl = null;
                if (logo != null && logo.Length > 0)
                {
                    var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "logos");
                    if (!Directory.Exists(uploadsFolder))
                        Directory.CreateDirectory(uploadsFolder);

                    var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(logo.FileName)}";
                    var filePath = Path.Combine(uploadsFolder, fileName);
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await logo.CopyToAsync(stream);
                    }
                    logoUrl = $"/logos/{fileName}";
                }

                var result = await _storeService.CreateStoreAsync(dto, logoUrl);
                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ CreateStore ERROR: {ex.Message}");
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // ============================================================
        // ADMIN ONLY – Update a store (with logo upload)
        // ============================================================
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStore(int id, [FromForm] StoreUpdateDto dto, IFormFile? logo)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                string? logoUrl = null;
                if (logo != null && logo.Length > 0)
                {
                    var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "logos");
                    if (!Directory.Exists(uploadsFolder))
                        Directory.CreateDirectory(uploadsFolder);

                    var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(logo.FileName)}";
                    var filePath = Path.Combine(uploadsFolder, fileName);
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await logo.CopyToAsync(stream);
                    }
                    logoUrl = $"/logos/{fileName}";
                }

                var result = await _storeService.UpdateStoreAsync(id, dto, logoUrl);
                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ UpdateStore({id}) ERROR: {ex.Message}");
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // ============================================================
        // ADMIN ONLY – Delete a store (soft delete)
        // ============================================================
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteStore(int id)
        {
            try
            {
                await _storeService.DeleteStoreAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ DeleteStore({id}) ERROR: {ex.Message}");
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}