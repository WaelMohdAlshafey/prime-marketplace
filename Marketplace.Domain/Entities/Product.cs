namespace Marketplace.Domain.Entities;

public class Product
{
    public int Id { get; set; }

    // Bilingual fields
    public string NameAr { get; set; } = string.Empty;
    public string NameEn { get; set; } = string.Empty;
    public string DescriptionAr { get; set; } = string.Empty;
    public string DescriptionEn { get; set; } = string.Empty;

    // Keep original for backward compatibility (or remove, but we'll keep them as fallback)
    // We'll mark them as [Obsolete] or just not use them
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public decimal Price { get; set; }
    public decimal CostPrice { get; set; }
    public int StockQuantity { get; set; }
    public int VendorId { get; set; }
    public string? ImageUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
    public double? Rating { get; set; }
    public string? Category { get; set; }
}