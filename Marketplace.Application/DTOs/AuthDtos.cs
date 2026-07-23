using System.ComponentModel.DataAnnotations;

namespace Marketplace.Application.DTOs;

// ============================================================
// REGISTER DTO
// ============================================================
public class RegisterDto
{
    [Required(ErrorMessage = "Username is required.")]
    public string Username { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "Invalid email address.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required.")]
    [MinLength(6, ErrorMessage = "Password must be at least 6 characters.")]
    public string Password { get; set; } = string.Empty;
}

// ============================================================
// LOGIN DTO
// ============================================================
public class LoginDto
{
    [Required(ErrorMessage = "Email is required.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required.")]
    public string Password { get; set; } = string.Empty;
}

// ============================================================
// AUTH RESPONSE DTO
// ============================================================
public class AuthResponseDto
{
    public int UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty; // <-- NEW: User role (Admin, Vendor, Customer)
    public string Token { get; set; } = string.Empty;
}