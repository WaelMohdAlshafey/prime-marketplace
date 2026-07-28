using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Marketplace.Application.Interfaces;

namespace Marketplace.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WishlistController : ControllerBase
{
    private readonly IWishlistService _wishlistService;

    public WishlistController(IWishlistService wishlistService)
    {
        _wishlistService = wishlistService;
    }

    private int GetUserId()
    {
        var claim = User.FindFirst("VendorId") ?? User.FindFirst(ClaimTypes.NameIdentifier);
        return int.Parse(claim!.Value);
    }

    [HttpGet]
    public async Task<IActionResult> GetWishlist()
    {
        var userId = GetUserId();
        var ids = await _wishlistService.GetUserWishlistIdsAsync(userId);
        return Ok(ids);
    }

    [HttpPost("{productId}")]
    public async Task<IActionResult> AddToWishlist(int productId)
    {
        var userId = GetUserId();
        await _wishlistService.AddToWishlistAsync(userId, productId);
        return Ok();
    }

    [HttpDelete("{productId}")]
    public async Task<IActionResult> RemoveFromWishlist(int productId)
    {
        var userId = GetUserId();
        await _wishlistService.RemoveFromWishlistAsync(userId, productId);
        return Ok();
    }
}