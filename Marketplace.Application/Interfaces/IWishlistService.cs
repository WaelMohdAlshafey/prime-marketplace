using Marketplace.Application.DTOs;

namespace Marketplace.Application.Interfaces;

public interface IWishlistService
{
    Task<List<int>> GetUserWishlistIdsAsync(int userId);
    Task AddToWishlistAsync(int userId, int productId);
    Task RemoveFromWishlistAsync(int userId, int productId);
}