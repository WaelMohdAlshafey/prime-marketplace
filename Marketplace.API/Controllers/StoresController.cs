using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;
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
        // HELPER: Check if user is Client/Customer
        // ============================================================
        private bool IsClientRole()
        {
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            return role == "Client" || role == "Customer";
        }

        // ============================================================
        // PUBLIC – Get all stores
        // ✅ Clients see only public stores (IsPublic = true)
        // ✅ Admin/Vendor/Employee see ALL stores
        // ============================================================
        [HttpGet]
        public async Task<IActionResult> GetStores([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            try
            {
                var isClient = IsClientRole();

                var query = _context.Stores
                    .Where(s => s.IsActive);

                // ✅ If Client, show ONLY public stores
                if (isClient)
                {
                    query = query.Where(s => s.IsPublic == true);
                }

                query = query.OrderBy(s => s.Name);

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
                        VendorUsername = _context.Users
                            .Where(u => u.Id == s.VendorId)
                            .Select(u => u.Username)
                            .FirstOrDefault() ?? "Unknown",
                        IsActive = s.IsActive,
                        CreatedAt = s.CreatedAt,
                        ProductCount = _context.Products.Count(p => p.VendorId == s.VendorId && p.IsActive),
                        IsPublic = s.IsPublic  // ✅ NEW
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
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // ============================================================
        // PUBLIC – Get a single store by ID
        // ✅ Clients can only see public stores
        // ============================================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetStore(int id)
        {
            try
            {
                var isClient = IsClientRole();

                var query = _context.Stores
                    .Where(s => s.Id == id && s.IsActive);

                // ✅ If Client, only allow public stores
                if (isClient)
                {
                    query = query.Where(s => s.IsPublic == true);
                }

                var store = await query
                    .Select(s => new StoreResponseDto
                    {
                        Id = s.Id,
                        Name = s.Name,
                        LogoUrl = s.LogoUrl,
                        Description = s.Description,
                        VendorId = s.VendorId,
                        VendorUsername = _context.Users
                            .Where(u => u.Id == s.VendorId)
                            .Select(u => u.Username)
                            .FirstOrDefault() ?? "Unknown",
                        IsActive = s.IsActive,
                        CreatedAt = s.CreatedAt,
                        ProductCount = _context.Products.Count(p => p.VendorId == s.VendorId && p.IsActive),
                        IsPublic = s.IsPublic
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
        // ✅ Clients can only see products from public stores
        // ============================================================
        [HttpGet("{id}/products")]
        public async Task<IActionResult> GetStoreProducts(int id, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            try
            {
                var isClient = IsClientRole();

                var storeQuery = _context.Stores
                    .Where(s => s.Id == id && s.IsActive);

                // ✅ If Client, only allow public stores
                if (isClient)
                {
                    storeQuery = storeQuery.Where(s => s.IsPublic == true);
                }

                var store = await storeQuery.FirstOrDefaultAsync();

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
        // ADMIN ONLY – Create a store
        // ✅ Admin can set IsPublic flag
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
        // ADMIN ONLY – Update a store
        // ✅ Admin can update IsPublic flag
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