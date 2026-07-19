namespace Marketplace.Application.DTOs;

public class StoreSettingDto
{
    public int Id { get; set; }
    public string StoreName { get; set; } = "Prime";
    public string Address { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public List<OwnerDto> Owners { get; set; } = new();
    public List<string> MobileNumbers { get; set; } = new();
    public List<string> Emails { get; set; } = new();
    public string Landline { get; set; } = string.Empty;
    public string WhatsApp { get; set; } = string.Empty;
}

public class OwnerDto
{
    public string Name { get; set; } = string.Empty;
}