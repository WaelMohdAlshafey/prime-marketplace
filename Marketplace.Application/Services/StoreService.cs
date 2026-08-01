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
            // Validate vendor
            var vendor = await _context.Users.FindAsync(dto.VendorId);
            if (vendor == null || vendor.Role != "Vendor")
                throw new Exception("Invalid vendor user.");

            // Check if vendor already has a store
            var existing = await _context.Stores.FirstOrDefaultAsync(s => s.VendorId == dto.VendorId);
            if (existing != null)
                throw new Exception("This vendor already has a store.");

            var store = new Store
            {
                Name = dto.Name,
                LogoUrl = logoUrl ?? dto.LogoUrl, // Prefer uploaded file, fallback to URL from DTO
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

            // Only update logo if a new one was uploaded
            if (!string.IsNullOrEmpty(logoUrl))
            {
                store.LogoUrl = logoUrl;
            }
            else if (!string.IsNullOrEmpty(dto.LogoUrl))
            {
                // Fallback to URL from DTO if provided (e.g., admin wants to set a URL manually)
                store.LogoUrl = dto.LogoUrl;
            }
            // If neither is provided, keep the existing logo

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

            store.IsActive = false; // Soft delete
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
            var query = _context.Stores
                .Include(s => s.Vendor)
                .AsQueryable();

            if (isActive.HasValue)
                query = query.Where(s => s.IsActive == isActive.Value);

            var totalCount = await query.CountAsync();
            var stores = await query
                .OrderBy(s => s.Name)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var dtos = new List<StoreResponseDto>();
            foreach (var store in stores)
            {
                dtos.Add(await MapToDto(store));
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

            // Use the product service to get products by vendor ID (which is the store's vendor)
            return await _productService.GetVendorProductsAsync(store.VendorId, page, pageSize);
        }

        // ============================================================
        // HELPER: Map Store entity to StoreResponseDto
        // ============================================================
        private async Task<StoreResponseDto> MapToDto(Store store)
        {
            var productCount = await _context.Products
                .CountAsync(p => p.VendorId == store.VendorId && p.IsActive);

            return new StoreResponseDto
            {
                Id = store.Id,
                Name = store.Name,
                LogoUrl = store.LogoUrl, // ✅ Now includes the uploaded logo URL
                Description = store.Description,
                VendorId = store.VendorId,
                VendorUsername = store.Vendor?.Username ?? "Unknown",
                IsActive = store.IsActive,
                CreatedAt = store.CreatedAt,
                ProductCount = productCount
            };
        }
    }
}