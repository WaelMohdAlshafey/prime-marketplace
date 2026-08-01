namespace Marketplace.Domain.Entities;

// Marketplace.Domain/Entities/StoreSetting.cs
public class StoreSetting
{
    public int Id { get; set; }
    public string StoreName { get; set; } = "Prime";
    public string Address { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string OwnersJson { get; set; } = "[]";
    public string MobileNumbersJson { get; set; } = "[]";
    public string EmailsJson { get; set; } = "[]";
    public string Landline { get; set; } = string.Empty;
    public string WhatsApp { get; set; } = string.Empty;
    public string Template { get; set; } = "standard";   // ✅ ADD THIS
}