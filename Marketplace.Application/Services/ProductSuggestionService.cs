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
    public class ProductSuggestionService : IProductSuggestionService
    {
        private readonly AppDbContext _context;
        private readonly IProductService _productService;

        public ProductSuggestionService(AppDbContext context, IProductService productService)
        {
            _context = context;
            _productService = productService;
        }

        public async Task<ProductSuggestionResponseDto> CreateSuggestionAsync(int userId, ProductSuggestionCreateDto dto, string? imageBase64 = null)
        {
            var suggestion = new ProductSuggestion
            {
                Name = dto.Name,
                Description = dto.Description,
                Category = dto.Category,
                VendorId = dto.VendorId,
                SuggestedPrice = dto.SuggestedPrice,
                EstimatedCostPrice = dto.EstimatedCostPrice,
                SuggestedStockQuantity = dto.SuggestedStockQuantity,
                ImageData = imageBase64,
                SuggestedByUserId = userId,
                CreatedAt = DateTime.UtcNow,
                Status = "Pending"
            };

            _context.ProductSuggestions.Add(suggestion);
            await _context.SaveChangesAsync();

            return await MapToResponseDto(suggestion);
        }

        public async Task<PagedResult<ProductSuggestionResponseDto>> GetSuggestionsAsync(int page, int pageSize, string? statusFilter = null)
        {
            var query = _context.ProductSuggestions
                .Include(s => s.SuggestedByUser)
                .Include(s => s.ReviewedByUser)
                .AsQueryable();

            if (!string.IsNullOrEmpty(statusFilter))
                query = query.Where(s => s.Status == statusFilter);

            var totalCount = await query.CountAsync();
            var items = await query
                .OrderByDescending(s => s.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var dtos = items.Select(s => MapToResponseDto(s).Result).ToList();

            return new PagedResult<ProductSuggestionResponseDto>
            {
                Items = dtos,
                TotalCount = totalCount,
                PageNumber = page,
                PageSize = pageSize
            };
        }

        public async Task<ProductSuggestionResponseDto> GetSuggestionByIdAsync(int id)
        {
            var suggestion = await _context.ProductSuggestions
                .Include(s => s.SuggestedByUser)
                .Include(s => s.ReviewedByUser)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (suggestion == null)
                throw new Exception("Suggestion not found.");

            return await MapToResponseDto(suggestion);
        }

        public async Task<ProductSuggestionResponseDto> ApproveSuggestionAsync(int adminUserId, int suggestionId, string? adminNote = null)
        {
            var suggestion = await _context.ProductSuggestions
                .Include(s => s.SuggestedByUser)
                .FirstOrDefaultAsync(s => s.Id == suggestionId);

            if (suggestion == null)
                throw new Exception("Suggestion not found.");

            if (suggestion.Status != "Pending")
                throw new Exception("This suggestion has already been reviewed.");

            // Create product from suggestion
            var product = new Product
            {
                Name = suggestion.Name,
                Description = suggestion.Description ?? "",
                Price = suggestion.SuggestedPrice ?? 0,
                CostPrice = suggestion.EstimatedCostPrice ?? 0,
                StockQuantity = suggestion.SuggestedStockQuantity ?? 0,
                VendorId = suggestion.VendorId ?? 1, // Default to first vendor if not specified
                ImageUrl = null, // You can save image to disk here if needed
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                Rating = null
            };

            // If we have image data, we could save it to disk and set ImageUrl
            if (!string.IsNullOrEmpty(suggestion.ImageData))
            {
                // Example: save to wwwroot/images/products
                // (you can implement this separately)
            }

            await _productService.CreateProductAsync(product, product.VendorId);

            // Update suggestion status
            suggestion.Status = "Approved";
            suggestion.ReviewedAt = DateTime.UtcNow;
            suggestion.ReviewedByUserId = adminUserId;
            suggestion.AdminNote = adminNote;

            await _context.SaveChangesAsync();

            return await MapToResponseDto(suggestion);
        }

        public async Task<ProductSuggestionResponseDto> RejectSuggestionAsync(int adminUserId, int suggestionId, string? adminNote = null)
        {
            var suggestion = await _context.ProductSuggestions
                .FirstOrDefaultAsync(s => s.Id == suggestionId);

            if (suggestion == null)
                throw new Exception("Suggestion not found.");

            if (suggestion.Status != "Pending")
                throw new Exception("This suggestion has already been reviewed.");

            suggestion.Status = "Rejected";
            suggestion.ReviewedAt = DateTime.UtcNow;
            suggestion.ReviewedByUserId = adminUserId;
            suggestion.AdminNote = adminNote;

            await _context.SaveChangesAsync();

            return await MapToResponseDto(suggestion);
        }

        private async Task<ProductSuggestionResponseDto> MapToResponseDto(ProductSuggestion s)
        {
            return new ProductSuggestionResponseDto
            {
                Id = s.Id,
                Name = s.Name,
                Description = s.Description,
                Category = s.Category,
                VendorId = s.VendorId,
                VendorName = s.VendorId.HasValue ? (await _context.Users.FindAsync(s.VendorId.Value))?.Username : null,
                SuggestedPrice = s.SuggestedPrice,
                EstimatedCostPrice = s.EstimatedCostPrice,
                SuggestedStockQuantity = s.SuggestedStockQuantity,
                ImageData = s.ImageData,
                Notes = s.AdminNote, // or we could store separate Notes field
                Status = s.Status,
                AdminNote = s.AdminNote,
                CreatedAt = s.CreatedAt,
                ReviewedAt = s.ReviewedAt,
                SuggestedByUsername = s.SuggestedByUser?.Username ?? "Unknown",
                ReviewedByUsername = s.ReviewedByUser?.Username
            };
        }
    }
}