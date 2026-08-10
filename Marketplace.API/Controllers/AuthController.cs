using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Marketplace.Application.DTOs;
using Marketplace.Application.Interfaces;
using Marketplace.Domain.Entities;
using Marketplace.Infrastructure.Data;
// BCrypt is used via fully qualified name

namespace Marketplace.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IGoldenLinkService _goldenLinkService;
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(
        IAuthService authService,
        IGoldenLinkService goldenLinkService,
        AppDbContext context,
        IConfiguration configuration)
    {
        _authService = authService;
        _goldenLinkService = goldenLinkService;
        _context = context;
        _configuration = configuration;
    }

    // ============================================================
    // PUBLIC ENDPOINTS (No authentication required)
    // ============================================================

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto registerDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var result = await _authService.RegisterAsync(registerDto);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto loginDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var result = await _authService.LoginAsync(loginDto);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // ============================================================
    // GOLDEN LOGIN (Magic Link)
    // ============================================================
    [HttpPost("golden-login")]
    [AllowAnonymous]
    public async Task<IActionResult> GoldenLogin([FromBody] GoldenLoginDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Token))
            return BadRequest(new { message = "Token is required." });

        var (valid, userId) = await _goldenLinkService.ValidateTokenAsync(request.Token);
        if (!valid)
            return BadRequest(new { message = "Invalid or expired golden link." });

        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            return BadRequest(new { message = "User not found." });

        // Mark token as used (one-time use)
        await _goldenLinkService.MarkTokenAsUsedAsync(request.Token);

        // Generate JWT token
        var token = GenerateJwtToken(user);

        return Ok(new AuthResponseDto
        {
            UserId = user.Id,
            Username = user.Username,
            Email = user.Email,
            Role = user.Role,
            Token = token
        });
    }

    // ============================================================
    // ADMIN-ONLY ENDPOINT (To create Vendor users)
    // ============================================================
    [HttpPost("create-vendor")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateVendor(RegisterDto registerDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var result = await _authService.CreateVendorAsync(registerDto);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // ============================================================
    // HELPER METHODS
    // ============================================================
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

// ============================================================
// DTO FOR GOLDEN LOGIN
// ============================================================
public class GoldenLoginDto
{
    public string Token { get; set; } = string.Empty;
}