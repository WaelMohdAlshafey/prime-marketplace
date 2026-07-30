using Marketplace.Application.DTOs;
using System.Threading.Tasks;

namespace Marketplace.Application.Interfaces
{
    public interface IStoreService
    {
        Task<StoreResponseDto> CreateStoreAsync(StoreCreateDto dto);
        Task<StoreResponseDto> UpdateStoreAsync(int storeId, StoreUpdateDto dto);
        Task DeleteStoreAsync(int storeId);
        Task<StoreResponseDto> GetStoreByIdAsync(int storeId);
        Task<PagedResult<StoreResponseDto>> GetAllStoresAsync(int page, int pageSize, bool? isActive = null);
        Task<PagedResult<ProductDto>> GetStoreProductsAsync(int storeId, int page, int pageSize);
    }
}