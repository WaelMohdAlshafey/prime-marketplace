using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Marketplace.Application.DTOs;
using Marketplace.Application.Interfaces;
using Marketplace.Domain.Entities;
using Marketplace.Infrastructure.Data;

namespace Marketplace.Application.Services
{
    public class StoreService : IStoreService
    {
        private readonly AppDbContext _context;
        private readonly IProductService _productService;

        public StoreService(AppDbContext context, IProductService productService)
        {
            _context = context;
            _productService = productService;
        }

        // ============================================================
        // CREATE STORE – accepts optional logoUrl from uploaded file
        // ============================================================
        public async Task<StoreResponseDto> CreateStoreAsync(StoreCreateDto dto, string? logoUrl = null)
        {
            var vendor = await _context.Users.FindAsync(dto.VendorId);
            if (vendor == null || vendor.Role != "Vendor")
                throw new Exception("Invalid vendor user.");

            var existing = await _context.Stores.FirstOrDefaultAsync(s => s.VendorId == dto.VendorId);
            if (existing != null)
                throw new Exception("This vendor already has a store.");

            var store = new Store
            {
                Name = dto.Name,
                LogoUrl = logoUrl ?? dto.LogoUrl,
                Description = dto.Description,
                VendorId = dto.VendorId,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.Stores.Add(store);
            await _context.SaveChangesAsync();

            return await MapToDto(store);
        }

        // ============================================================
        // UPDATE STORE – accepts optional logoUrl from uploaded file
        // ============================================================
        public async Task<StoreResponseDto> UpdateStoreAsync(int storeId, StoreUpdateDto dto, string? logoUrl = null)
        {
            var store = await _context.Stores.FindAsync(storeId);
            if (store == null)
                throw new Exception("Store not found.");

            store.Name = dto.Name;
            store.Description = dto.Description;
            store.IsActive = dto.IsActive;

            if (!string.IsNullOrEmpty(logoUrl))
                store.LogoUrl = logoUrl;
            else if (!string.IsNullOrEmpty(dto.LogoUrl))
                store.LogoUrl = dto.LogoUrl;

            await _context.SaveChangesAsync();

            return await MapToDto(store);
        }

        // ============================================================
        // SOFT DELETE STORE
        // ============================================================
        public async Task DeleteStoreAsync(int storeId)
        {
            var store = await _context.Stores.FindAsync(storeId);
            if (store == null)
                throw new Exception("Store not found.");

            store.IsActive = false;
            await _context.SaveChangesAsync();
        }

        // ============================================================
        // GET STORE BY ID
        // ============================================================
        public async Task<StoreResponseDto> GetStoreByIdAsync(int storeId)
        {
            var store = await _context.Stores
                .Include(s => s.Vendor)
                .FirstOrDefaultAsync(s => s.Id == storeId);

            if (store == null)
                throw new Exception("Store not found.");

            return await MapToDto(store);
        }

        // ============================================================
        // GET ALL STORES (with optional active filter)
        // ============================================================
        public async Task<PagedResult<StoreResponseDto>> GetAllStoresAsync(int page, int pageSize, bool? isActive = null)
        {
            // ✅ Manual join – guaranteed to load the vendor name
            var query = from store in _context.Stores
                        join user in _context.Users on store.VendorId equals user.Id into vendorGroup
                        from vendor in vendorGroup.DefaultIfEmpty()
                        select new { store, vendor };

            if (isActive.HasValue)
                query = query.Where(x => x.store.IsActive == isActive.Value);

            var totalCount = await query.CountAsync();

            var results = await query
                .OrderBy(x => x.store.Name)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var dtos = results.Select(x => new StoreResponseDto
            {
                Id = x.store.Id,
                Name = x.store.Name,
                LogoUrl = x.store.LogoUrl,
                Description = x.store.Description,
                VendorId = x.store.VendorId,
                VendorUsername = x.vendor?.Username ?? "Unknown",
                IsActive = x.store.IsActive,
                CreatedAt = x.store.CreatedAt,
                ProductCount = 0 // Will be filled below
            }).ToList();

            // Count products for each store
            foreach (var dto in dtos)
            {
                dto.ProductCount = await _context.Products
                    .CountAsync(p => p.VendorId == dto.VendorId && p.IsActive);
            }

            return new PagedResult<StoreResponseDto>
            {
                Items = dtos,
                TotalCount = totalCount,
                PageNumber = page,
                PageSize = pageSize
            };
        }
        // ============================================================
        // GET PRODUCTS OF A STORE (using the store's vendor)
        // ============================================================
        public async Task<PagedResult<ProductDto>> GetStoreProductsAsync(int storeId, int page, int pageSize)
        {
            var store = await _context.Stores.FindAsync(storeId);
            if (store == null)
                throw new Exception("Store not found.");

            return await _productService.GetVendorProductsAsync(store.VendorId, page, pageSize);
        }

        // ============================================================
        // HELPER: Map Store entity to StoreResponseDto
        // ============================================================
        private async Task<StoreResponseDto> MapToDto(Store store)
        {
            var productCount = await _context.Products
                .CountAsync(p => p.VendorId == store.VendorId && p.IsActive);

            // 🔍 DEBUG: Log the vendor information to see if it's being loaded
            Console.WriteLine($"🔍 MapToDto: Store={store.Name}, VendorId={store.VendorId}, Vendor={(store.Vendor?.Username ?? "NULL")}");

            // ✅ This should now work because Vendor is included
            string vendorUsername = store.Vendor?.Username ?? "Unknown";

            return new StoreResponseDto
            {
                Id = store.Id,
                Name = store.Name,
                LogoUrl = store.LogoUrl,
                Description = store.Description,
                VendorId = store.VendorId,
                VendorUsername = vendorUsername,
                IsActive = store.IsActive,
                CreatedAt = store.CreatedAt,
                ProductCount = productCount
            };
        }
    }
}