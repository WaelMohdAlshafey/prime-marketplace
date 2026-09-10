namespace Marketplace.Application.DTOs;

public class PageClassDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Icon { get; set; }
    public string? ColorClass { get; set; }
    public int? DisplayOrder { get; set; }
    public bool IsActive { get; set; }
    public int PageCount { get; set; }
}

public class CreatePageClassDto
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Icon { get; set; }
    public string? ColorClass { get; set; }
    public int? DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
}

public class UpdatePageClassDto : CreatePageClassDto { }