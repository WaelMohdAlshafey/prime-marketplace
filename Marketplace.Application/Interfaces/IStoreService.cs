using Marketplace.Application.DTOs;
using System.Threading.Tasks;

namespace Marketplace.Application.Interfaces
{
    public interface IStoreService
    {
        // ✅ Added optional logoUrl parameter
        Task<StoreResponseDto> CreateStoreAsync(StoreCreateDto dto, string? logoUrl = null);

        // ✅ Added optional logoUrl parameter
        Task<StoreResponseDto> UpdateStoreAsync(int storeId, StoreUpdateDto dto, string? logoUrl = null);

        Task DeleteStoreAsync(int storeId);
        Task<StoreResponseDto> GetStoreByIdAsync(int storeId);
        Task<PagedResult<StoreResponseDto>> GetAllStoresAsync(int page, int pageSize, bool? isActive = null);
        Task<PagedResult<ProductDto>> GetStoreProductsAsync(int storeId, int page, int pageSize);
    }
}