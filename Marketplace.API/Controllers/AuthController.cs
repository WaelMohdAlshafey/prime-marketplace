using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Marketplace.Application.DTOs;
using Marketplace.Application.Interfaces;

namespace Marketplace.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
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
    // ADMIN-ONLY ENDPOINT (To create Vendor users)
    // ============================================================

    [HttpPost("create-vendor")]
    [Authorize(Roles = "Admin")] // <-- Only Admins can create vendors
    public async Task<IActionResult> CreateVendor(RegisterDto registerDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            // This method is identical to Register but we'll let the AuthService
            // know this is a vendor creation. We'll modify the AuthService to accept a role parameter.
            var result = await _authService.CreateVendorAsync(registerDto);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}