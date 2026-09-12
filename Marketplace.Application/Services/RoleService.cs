using Microsoft.EntityFrameworkCore;
using Marketplace.Application.DTOs;
using Marketplace.Application.Interfaces;
using Marketplace.Domain.Entities;
using Marketplace.Infrastructure.Data;

namespace Marketplace.Application.Services;

public class RoleService : IRoleService
{
    private readonly AppDbContext _context;

    public RoleService(AppDbContext context) { _context = context; }

    public async Task<List<RoleDto>> GetAllAsync()
    {
        return await _context.Roles
            .OrderBy(r => r.IsSystemRole ? 0 : 1)
            .ThenBy(r => r.Name)
            .Select(r => new RoleDto
            {
                Id = r.Id,
                Name = r.Name,
                Description = r.Description,
                IsSystemRole = r.IsSystemRole,
                UserCount = _context.Users.Count(u => u.Role == r.Name)
            })
            .ToListAsync();
    }

    public async Task<RoleDto> GetByIdAsync(int id)
    {
        var r = await _context.Roles.FindAsync(id);
        if (r == null) throw new Exception("Role not found.");
        return new RoleDto
        {
            Id = r.Id,
            Name = r.Name,
            Description = r.Description,
            IsSystemRole = r.IsSystemRole
        };
    }

    public async Task<RoleDto> CreateAsync(CreateRoleDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            throw new Exception("Role name is required.");

        if (await _context.Roles.AnyAsync(r => r.Name == dto.Name))
            throw new Exception("A role with this name already exists.");

        var r = new Role
        {
            Name = dto.Name,
            Description = dto.Description,
            IsSystemRole = false
        };
        _context.Roles.Add(r);
        await _context.SaveChangesAsync();
        return await GetByIdAsync(r.Id);
    }

    public async Task<RoleDto> UpdateAsync(int id, UpdateRoleDefinitionDto dto)
    {
        var r = await _context.Roles.FindAsync(id);
        if (r == null) throw new Exception("Role not found.");

        if (r.IsSystemRole && r.Name != dto.Name)
            throw new Exception("System roles cannot be renamed.");

        if (await _context.Roles.AnyAsync(x => x.Name == dto.Name && x.Id != id))
            throw new Exception("A role with this name already exists.");

        r.Name = dto.Name;
        r.Description = dto.Description;
        await _context.SaveChangesAsync();
        return await GetByIdAsync(r.Id);
    }

    public async Task DeleteAsync(int id)
    {
        var r = await _context.Roles.FindAsync(id);
        if (r == null) throw new Exception("Role not found.");
        if (r.IsSystemRole) throw new Exception("System roles cannot be deleted.");

        if (await _context.Users.AnyAsync(u => u.Role == r.Name))
            throw new Exception("Cannot delete a role that still has users assigned.");

        _context.Roles.Remove(r);
        await _context.SaveChangesAsync();
    }
}