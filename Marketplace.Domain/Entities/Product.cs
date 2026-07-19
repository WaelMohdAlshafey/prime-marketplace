public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal CostPrice { get; set; }     // <-- Must exist
    public int StockQuantity { get; set; }
    public int VendorId { get; set; }
    public string? ImageUrl { get; set; }      // <-- Must exist
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
}