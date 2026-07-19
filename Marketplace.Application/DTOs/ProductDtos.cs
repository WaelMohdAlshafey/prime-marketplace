using System.ComponentModel.DataAnnotations;

namespace Marketplace.Application.DTOs;

public class ProductDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
    public string? ImageUrl { get; set; }
    // CostPrice is intentionally excluded from public DTO
}

public class ProductCreateDto
{
    [Required]
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    [Required]
    [Range(0.01, 999999.99)]
    public decimal Price { get; set; }
    [Required]
    [Range(0, 999999.99)]
    public decimal CostPrice { get; set; }
    [Required]
    [Range(0, int.MaxValue)]
    public int StockQuantity { get; set; }
    public bool IsActive { get; set; } = true;
}

public class ProductUpdateDto
{
    [Required]
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    [Required]
    [Range(0.01, 999999.99)]
    public decimal Price { get; set; }
    [Required]
    [Range(0, 999999.99)]
    public decimal CostPrice { get; set; }
    [Required]
    [Range(0, int.MaxValue)]
    public int StockQuantity { get; set; }
    public bool IsActive { get; set; } = true;
    public string? ExistingImageUrl { get; set; }
}