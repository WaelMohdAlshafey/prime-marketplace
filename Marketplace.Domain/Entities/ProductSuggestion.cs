using System;

namespace Marketplace.Domain.Entities
{
    public class ProductSuggestion
    {
        public int Id { get; set; }

        // Product details
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Category { get; set; }
        public int? VendorId { get; set; } // Suggested vendor (optional)
        public decimal? SuggestedPrice { get; set; }
        public decimal? EstimatedCostPrice { get; set; }
        public int? SuggestedStockQuantity { get; set; }
        public string? ImageData { get; set; } // Base64 encoded image (or URL if we save file)

        // Suggestion metadata
        public int SuggestedByUserId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected
        public string? AdminNote { get; set; }
        public DateTime? ReviewedAt { get; set; }
        public int? ReviewedByUserId { get; set; }

        // Navigation properties
        public virtual User? SuggestedByUser { get; set; }
        public virtual User? ReviewedByUser { get; set; }
    }
}