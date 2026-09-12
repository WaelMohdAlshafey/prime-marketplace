using Marketplace.Application.DTOs;

namespace Marketplace.Application.Interfaces;

public interface IRoleService
{
    Task<List<RoleDto>> GetAllAsync();
    Task<RoleDto> GetByIdAsync(int id);
    Task<RoleDto> CreateAsync(CreateRoleDto dto);
    Task<RoleDto> UpdateAsync(int id, UpdateRoleDefinitionDto dto);
    Task DeleteAsync(int id);
}