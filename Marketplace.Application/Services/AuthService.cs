using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Marketplace.Application.DTOs;
using Marketplace.Application.Interfaces;
using Marketplace.Domain.Entities;
using Marketplace.Infrastructure.Data;
// No using for BCrypt – we will use fully qualified names

namespace Marketplace.Application.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthService(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto)
    {
        var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == registerDto.Email);
        if (existingUser != null)
        {
            throw new Exception("User with this email already exists.");
        }

        // Use fully qualified name
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

        var user = new User
        {
            Username = registerDto.Username,
            Email = registerDto.Email,
            PasswordHash = passwordHash,
            Role = "Customer",
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var token = GenerateJwtToken(user);

        return new AuthResponseDto
        {
            UserId = user.Id,
            Username = user.Username,
            Email = user.Email,
            Token = token,
            Role = user.Role  // <-- MAKE SURE THIS LINE EXISTS
        };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);
        if (user == null)
        {
            throw new Exception("Invalid email or password.");
        }

        // Use fully qualified name
        bool isValidPassword = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash);
        if (!isValidPassword)
        {
            throw new Exception("Invalid email or password.");
        }

        var token = GenerateJwtToken(user);

        return new AuthResponseDto
        {
            UserId = user.Id,
            Username = user.Username,
            Email = user.Email,
            Role = user.Role,
            Token = token
        };
    }

    public async Task<AuthResponseDto> CreateVendorAsync(RegisterDto registerDto)
    {
        var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == registerDto.Email);
        if (existingUser != null)
        {
            throw new Exception("User with this email already exists.");
        }

        // Use fully qualified name
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

        var user = new User
        {
            Username = registerDto.Username,
            Email = registerDto.Email,
            PasswordHash = passwordHash,
            Role = "Vendor",
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var token = GenerateJwtToken(user);

        return new AuthResponseDto
        {
            UserId = user.Id,
            Username = user.Username,
            Email = user.Email,
            Role = user.Role,
            Token = token
        };
    }

    private string GenerateJwtToken(User user)
    {
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? "ThisIsASuperSecretKeyWithAtLeast32CharactersLongForJWT!");
        var tokenHandler = new JwtSecurityTokenHandler();

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim("VendorId", user.Id.ToString())
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}