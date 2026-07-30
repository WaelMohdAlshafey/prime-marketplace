using System;

namespace Marketplace.Application.DTOs
{
    public class ProductSuggestionCreateDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Category { get; set; }
        public int? VendorId { get; set; }
        public decimal? SuggestedPrice { get; set; }
        public decimal? EstimatedCostPrice { get; set; }
        public int? SuggestedStockQuantity { get; set; }
        public string? Notes { get; set; }
    }

    public class ProductSuggestionResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Category { get; set; }
        public int? VendorId { get; set; }
        public string? VendorName { get; set; }
        public decimal? SuggestedPrice { get; set; }
        public decimal? EstimatedCostPrice { get; set; }
        public int? SuggestedStockQuantity { get; set; }
        public string? ImageData { get; set; }
        public string? Notes { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? AdminNote { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ReviewedAt { get; set; }
        public string SuggestedByUsername { get; set; } = string.Empty;
        public string? ReviewedByUsername { get; set; }
    }

    public class SuggestionActionDto
    {
        public string? AdminNote { get; set; }
    }
}