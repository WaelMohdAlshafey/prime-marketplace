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
        _baseUrl = configuration["AppSettings:BaseUrl"] ?? "http://localhost:3000";
    }

    public async Task<GenerateGoldenLinkResponseDto> GenerateLinkAsync(
        int currentUserId,
        int? targetUserId,
        int expiryDays,
        string? redirectPath,
        bool isAdmin)
    {
        if (expiryDays < 1 || expiryDays > 30)
            throw new Exception("Expiry days must be between 1 and 30.");

        int userId = targetUserId ?? currentUserId;

        if (!isAdmin && targetUserId.HasValue && targetUserId.Value != currentUserId)
            throw new Exception("You can only generate links for yourself.");

        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            throw new Exception("User not found.");

        var token = GenerateSecureToken();

        var goldenLink = new GoldenLink
        {
            Token = token,
            UserId = userId,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddDays(expiryDays),
            IsUsed = false,
            CreatedBy = isAdmin ? "Admin" : user.Username,
            RedirectPath = redirectPath ?? "/"
        };

        _context.GoldenLinks.Add(goldenLink);
        await _context.SaveChangesAsync();

        var link = $"{_baseUrl}/auth/golden-links?token={token}";

        return new GenerateGoldenLinkResponseDto
        {
            Token = token,
            Link = link,
            ExpiresAt = goldenLink.ExpiresAt,
            UserId = userId,
            UserName = user.Username,
            RedirectPath = goldenLink.RedirectPath
        };
    }

    public async Task<(bool valid, int userId, string? redirectPath)> ValidateTokenAsync(string token)
    {
        var link = await _context.GoldenLinks
            .FirstOrDefaultAsync(gl => gl.Token == token);

        if (link == null)
            return (false, 0, null);

        // ✅ No IsUsed check – multiple uses allowed until expiry
        if (link.ExpiresAt < DateTime.UtcNow)
            return (false, 0, null);

        return (true, link.UserId, link.RedirectPath);
    }

    public async Task MarkTokenAsUsedAsync(string token)
    {
        // Kept for compatibility but not used
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
        var bytes = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(bytes);
        return Convert.ToBase64String(bytes)
            .Replace('+', '-')
            .Replace('/', '_')
            .TrimEnd('=');
    }
}