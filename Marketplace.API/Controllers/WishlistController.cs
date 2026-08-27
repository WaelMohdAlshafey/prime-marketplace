using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;
using Marketplace.Application.Interfaces;

namespace Marketplace.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("AllowAll")]   // ← This ensures CORS headers are sent for all actions
    [Authorize]                // ← All endpoints require authentication
    public class WishlistController : ControllerBase
    {
        private readonly IWishlistService _wishlistService;

        public WishlistController(IWishlistService wishlistService)
        {
            _wishlistService = wishlistService;
        }

        // Helper to get current user ID from JWT claims
        private int GetUserId()
        {
            var claim = User.FindFirst("VendorId") ?? User.FindFirst(ClaimTypes.NameIdentifier);
            return int.Parse(claim!.Value);
        }

        // ============================================================
        // GET /api/Wishlist – returns list of product IDs in the user's wishlist
        // ============================================================
        [HttpGet]
        public async Task<IActionResult> GetWishlist()
        {
            var userId = GetUserId();
            var ids = await _wishlistService.GetUserWishlistIdsAsync(userId);
            return Ok(ids);   // returns e.g., [1, 5, 12]
        }

        // ============================================================
        // POST /api/Wishlist/{productId} – adds product to wishlist
        // ============================================================
        [HttpPost("{productId}")]
        public async Task<IActionResult> AddToWishlist(int productId)
        {
            var userId = GetUserId();
            await _wishlistService.AddToWishlistAsync(userId, productId);
            return Ok(new { message = "Product added to wishlist." });
        }

        // ============================================================
        // DELETE /api/Wishlist/{productId} – removes product from wishlist
        // ============================================================
        [HttpDelete("{productId}")]
        public async Task<IActionResult> RemoveFromWishlist(int productId)
        {
            var userId = GetUserId();
            await _wishlistService.RemoveFromWishlistAsync(userId, productId);
            return Ok(new { message = "Product removed from wishlist." });
        }
    }
}