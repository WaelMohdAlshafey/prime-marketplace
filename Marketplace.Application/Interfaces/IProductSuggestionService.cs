using Marketplace.Application.DTOs;
using System.Threading.Tasks;

namespace Marketplace.Application.Interfaces
{
    public interface IProductSuggestionService
    {
        Task<ProductSuggestionResponseDto> CreateSuggestionAsync(int userId, ProductSuggestionCreateDto dto, string? imageBase64 = null);
        Task<PagedResult<ProductSuggestionResponseDto>> GetSuggestionsAsync(int page, int pageSize, string? statusFilter = null);
        Task<ProductSuggestionResponseDto> GetSuggestionByIdAsync(int id);
        Task<ProductSuggestionResponseDto> ApproveSuggestionAsync(int adminUserId, int suggestionId, string? adminNote = null);
        Task<ProductSuggestionResponseDto> RejectSuggestionAsync(int adminUserId, int suggestionId, string? adminNote = null);
    }
}