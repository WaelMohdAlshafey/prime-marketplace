using Marketplace.Application.DTOs;

namespace Marketplace.Application.Interfaces;

public interface IPageClassService
{
    Task<List<PageClassDto>> GetAllAsync(bool onlyActive = false);
    Task<PageClassDto> GetByIdAsync(int id);
    Task<PageClassDto> CreateAsync(CreatePageClassDto dto);
    Task<PageClassDto> UpdateAsync(int id, UpdatePageClassDto dto);
    Task DeleteAsync(int id);
}