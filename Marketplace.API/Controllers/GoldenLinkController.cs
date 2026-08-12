using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Marketplace.Application.DTOs;
using Marketplace.Application.Interfaces;

namespace Marketplace.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class GoldenLinkController : ControllerBase
{
    private readonly IGoldenLinkService _goldenLinkService;

    public GoldenLinkController(IGoldenLinkService goldenLinkService)
    {
        _goldenLinkService = goldenLinkService;
    }

    private int GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("VendorId");
        return int.Parse(claim!.Value);
    }

    [HttpPost("generate")]
    public async Task<IActionResult> Generate([FromBody] GenerateGoldenLinkRequestDto request)
    {
        var userId = GetUserId();
        var isAdmin = User.IsInRole("Admin");

        try
        {
            var result = await _goldenLinkService.GenerateLinkAsync(
                userId,
                request.UserId,
                request.ExpiryDays,
                request.RedirectPath,   // ✅ pass the redirect path
                isAdmin
            );
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}