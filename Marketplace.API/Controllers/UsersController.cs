using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using BCrypt.Net; // <-- THIS MUST BE HERE
using Marketplace.Domain.Entities;
using Marketplace.Infrastructure.Data;
using Marketplace.Application.DTOs;

namespace Marketplace.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsersController(AppDbContext context)
    {
        _context = context;
    }

    // ============================================================
    // 1. GET ALL USERS
    // ============================================================
    [HttpGet]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _context.Users
            .Select(u => new
            {
                u.Id,
                u.Username,
                u.Email,
                u.Role,
                u.CreatedAt
            })
            .OrderBy(u => u.Id)
            .ToListAsync();

        return Ok(users);
    }

    // ============================================================
    // 2. GET A SINGLE USER BY ID
    // ============================================================
    [HttpGet("{id}")]
    public async Task<IActionResult> GetUserById(int id)
    {
        var user = await _context.Users
            .Where(u => u.Id == id)
            .Select(u => new
            {
                u.Id,
                u.Username,
                u.Email,
                u.Role,
                u.CreatedAt
            })
            .FirstOrDefaultAsync();

        if (user == null)
            return NotFound(new { message = "User not found." });

        return Ok(user);
    }

    // ============================================================
    // 3. UPDATE USER ROLE
    // ============================================================
    [HttpPut("{id}/role")]
    public async Task<IActionResult> UpdateUserRole(int id, [FromBody] UpdateRoleDto request)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return NotFound(new { message = "User not found." });

        // Prevent changing the role of the last Admin
        if (user.Role == "Admin" && request.Role != "Admin")
        {
            var adminCount = await _context.Users.CountAsync(u => u.Role == "Admin");
            if (adminCount <= 1)
                return BadRequest(new { message = "Cannot remove the last Admin role." });
        }

        user.Role = request.Role;
        await _context.SaveChangesAsync();

        return Ok(new { message = $"User role updated to {request.Role}." });
    }

    // ============================================================
    // 4. RESET USER PASSWORD
    // ============================================================
    [HttpPut("{id}/reset-password")]
    public async Task<IActionResult> ResetUserPassword(int id, [FromBody] ResetPasswordDto request)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return NotFound(new { message = "User not found." });

        // Hash the new password using BCrypt
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Password reset successfully." });
    }

    // ============================================================
    // 5. DELETE A USER
    // ============================================================
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return NotFound(new { message = "User not found." });

        // Prevent deleting the last Admin
        if (user.Role == "Admin")
        {
            var adminCount = await _context.Users.CountAsync(u => u.Role == "Admin");
            if (adminCount <= 1)
                return BadRequest(new { message = "Cannot delete the last Admin user." });
        }

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "User deleted successfully." });
    }

    // ============================================================
    // 6. CREATE A NEW USER (Admin only)
    // ============================================================
    [HttpPost]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserDto request)
    {
        // Check if email already exists
        if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            return BadRequest(new { message = "Email already exists." });

        // Check if username already exists
        if (await _context.Users.AnyAsync(u => u.Username == request.Username))
            return BadRequest(new { message = "Username already exists." });

        var user = new User
        {
            Username = request.Username,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = request.Role ?? "Customer",
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "User created successfully.",
            user = new { user.Id, user.Username, user.Email, user.Role }
        });
    }
}

// ============================================================
// DTOs (kept inside the controller file for simplicity)
// ============================================================

public class UpdateRoleDto
{
    public string Role { get; set; } = string.Empty;
}

public class ResetPasswordDto
{
    public string NewPassword { get; set; } = string.Empty;
}

public class CreateUserDto
{
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? Role { get; set; } = "Customer";
}