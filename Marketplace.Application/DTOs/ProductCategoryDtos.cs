namespace Marketplace.Application.DTOs;

public class ProductCategoryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Icon { get; set; }
    public string? ColorClass { get; set; }
    public int? DisplayOrder { get; set; }
    public bool IsActive { get; set; }
    public int ProductCount { get; set; }
}

public class CreateProductCategoryDto
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Icon { get; set; }
    public string? ColorClass { get; set; }
    public int? DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
}

public class UpdateProductCategoryDto : CreateProductCategoryDto { }