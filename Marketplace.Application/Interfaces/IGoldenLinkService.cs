using Marketplace.Application.DTOs;
using System.Threading.Tasks;

namespace Marketplace.Application.Interfaces;

public interface IGoldenLinkService
{
    Task<GenerateGoldenLinkResponseDto> GenerateLinkAsync(
        int currentUserId,
        int? targetUserId,
        int expiryDays,
        string? redirectPath,
        bool isAdmin
    );

    Task<(bool valid, int userId, string? redirectPath)> ValidateTokenAsync(string token);
    Task MarkTokenAsUsedAsync(string token);
}