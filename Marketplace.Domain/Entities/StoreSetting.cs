namespace Marketplace.Domain.Entities;

public class StoreSetting
{
    public int Id { get; set; }
    public string StoreName { get; set; } = "Prime";
    public string Address { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;

    // Stored as JSON strings to easily handle arrays
    public string OwnersJson { get; set; } = "[]"; // e.g., [{"name":"Ahmed"}]
    public string MobileNumbersJson { get; set; } = "[]";
    public string EmailsJson { get; set; } = "[]";

    public string Landline { get; set; } = string.Empty;
    public string WhatsApp { get; set; } = string.Empty;
}