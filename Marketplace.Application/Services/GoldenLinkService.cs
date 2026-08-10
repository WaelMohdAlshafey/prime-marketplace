using System;
using System.Security.Cryptography;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Marketplace.Application.DTOs;
using Marketplace.Application.Interfaces;
using Marketplace.Domain.Entities;
using Marketplace.Infrastructure.Data;

namespace Marketplace.Application.Services;

public class GoldenLinkService : IGoldenLinkService
{
    private readonly AppDbContext _context;
    private readonly string _baseUrl;

    public GoldenLinkService(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        // Read the base URL from configuration, fallback to localhost
        _baseUrl = configuration["AppSettings:BaseUrl"] ?? "http://localhost:3000";
    }

    public async Task<GenerateGoldenLinkResponseDto> GenerateLinkAsync(
        int currentUserId,
        int? targetUserId,
        int expiryDays,
        bool isAdmin)
    {
        // Validate expiry days
        if (expiryDays < 1 || expiryDays > 30)
            throw new Exception("Expiry days must be between 1 and 30.");

        // Determine the target user ID
        int userId = targetUserId ?? currentUserId;

        // Security: non-admin can only generate for themselves
        if (!isAdmin && targetUserId.HasValue && targetUserId.Value != currentUserId)
            throw new Exception("You can only generate links for yourself.");

        // Check if the target user exists
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            throw new Exception("User not found.");

        // Generate a secure random token
        var token = GenerateSecureToken();

        // Create the golden link entity
        var goldenLink = new GoldenLink
        {
            Token = token,
            UserId = userId,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddDays(expiryDays),
            IsUsed = false,
            CreatedBy = isAdmin ? "Admin" : user.Username
        };

        // Save to database
        _context.GoldenLinks.Add(goldenLink);
        await _context.SaveChangesAsync();

        // Build the full link URL
        var link = $"{_baseUrl}/auth/golden-login?token={token}"; // ✅ FIXED: correct path

        return new GenerateGoldenLinkResponseDto
        {
            Token = token,
            Link = link,
            ExpiresAt = goldenLink.ExpiresAt,
            UserId = userId,
            UserName = user.Username
        };
    }

    public async Task<(bool valid, int userId)> ValidateTokenAsync(string token)
    {
        // Find the token in the database
        var link = await _context.GoldenLinks
            .FirstOrDefaultAsync(gl => gl.Token == token);

        if (link == null)
            return (false, 0);

        // Check if already used
        if (link.IsUsed)
            return (false, 0);

        // Check if expired
        if (link.ExpiresAt < DateTime.UtcNow)
            return (false, 0);

        return (true, link.UserId);
    }

    public async Task MarkTokenAsUsedAsync(string token)
    {
        var link = await _context.GoldenLinks
            .FirstOrDefaultAsync(gl => gl.Token == token);

        if (link != null)
        {
            link.IsUsed = true;
            await _context.SaveChangesAsync();
        }
    }

    private static string GenerateSecureToken()
    {
        // Generate 32 bytes of cryptographically strong random data
        var bytes = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(bytes);
        // Convert to a URL‑safe base64 string
        return Convert.ToBase64String(bytes)
            .Replace('+', '-')
            .Replace('/', '_')
            .TrimEnd('=');
    }
}