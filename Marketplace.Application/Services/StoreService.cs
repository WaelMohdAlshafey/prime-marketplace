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

        public async Task<StoreResponseDto> CreateStoreAsync(StoreCreateDto dto)
        {
            // Ensure vendor exists and has Vendor role
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
                LogoUrl = dto.LogoUrl,
                Description = dto.Description,
                VendorId = dto.VendorId,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.Stores.Add(store);
            await _context.SaveChangesAsync();

            return await MapToDto(store);
        }

        public async Task<StoreResponseDto> UpdateStoreAsync(int storeId, StoreUpdateDto dto)
        {
            var store = await _context.Stores.FindAsync(storeId);
            if (store == null)
                throw new Exception("Store not found.");

            store.Name = dto.Name;
            store.LogoUrl = dto.LogoUrl;
            store.Description = dto.Description;
            store.IsActive = dto.IsActive;

            await _context.SaveChangesAsync();

            return await MapToDto(store);
        }

        public async Task DeleteStoreAsync(int storeId)
        {
            var store = await _context.Stores.FindAsync(storeId);
            if (store == null)
                throw new Exception("Store not found.");

            store.IsActive = false; // Soft delete
            await _context.SaveChangesAsync();
        }

        public async Task<StoreResponseDto> GetStoreByIdAsync(int storeId)
        {
            var store = await _context.Stores
                .Include(s => s.Vendor)
                .FirstOrDefaultAsync(s => s.Id == storeId);

            if (store == null)
                throw new Exception("Store not found.");

            return await MapToDto(store);
        }

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

        public async Task<PagedResult<ProductDto>> GetStoreProductsAsync(int storeId, int page, int pageSize)
        {
            var store = await _context.Stores.FindAsync(storeId);
            if (store == null)
                throw new Exception("Store not found.");

            // Use the product service to get products by vendor ID (which is the store's vendor)
            return await _productService.GetVendorProductsAsync(store.VendorId, page, pageSize);
        }

        private async Task<StoreResponseDto> MapToDto(Store store)
        {
            var productCount = await _context.Products.CountAsync(p => p.VendorId == store.VendorId && p.IsActive);
            return new StoreResponseDto
            {
                Id = store.Id,
                Name = store.Name,
                LogoUrl = store.LogoUrl,
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