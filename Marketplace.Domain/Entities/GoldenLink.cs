using System;

namespace Marketplace.Domain.Entities;

public class GoldenLink
{
    public int Id { get; set; }
    public string Token { get; set; } = string.Empty;
    public int UserId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime ExpiresAt { get; set; }
    public bool IsUsed { get; set; } = false;
    public string? CreatedBy { get; set; }
    public string? RedirectPath { get; set; } = "/";   // ✅ NEW

    public virtual User? User { get; set; }
}