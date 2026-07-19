namespace Marketplace.Domain.Entities;

public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty; // Store hashed password
    public string Role { get; set; } = "Vendor"; // "Admin" or "Vendor"
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}