using Marketplace.Application.DTOs;
using System.Threading.Tasks;

namespace Marketplace.Application.Interfaces;

public interface IGoldenLinkService
{
    Task<GenerateGoldenLinkResponseDto> GenerateLinkAsync(
        int currentUserId,
        int? targetUserId,
        int expiryDays,
        bool isAdmin
    );

    Task<(bool valid, int userId)> ValidateTokenAsync(string token);
    Task MarkTokenAsUsedAsync(string token);
}