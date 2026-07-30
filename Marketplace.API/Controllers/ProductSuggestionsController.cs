using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;
using Marketplace.Application.DTOs;
using Marketplace.Application.Interfaces;

namespace Marketplace.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProductSuggestionsController : ControllerBase
    {
        private readonly IProductSuggestionService _suggestionService;

        public ProductSuggestionsController(IProductSuggestionService suggestionService)
        {
            _suggestionService = suggestionService;
        }

        private int GetUserId()
        {
            var claim = User.FindFirst("VendorId") ?? User.FindFirst(ClaimTypes.NameIdentifier);
            return int.Parse(claim!.Value);
        }

        // ============================================================
        // POST: /api/ProductSuggestions
        // Submit a new product suggestion (any authenticated user)
        // ============================================================
        [HttpPost]
        public async Task<IActionResult> SubmitSuggestion([FromForm] ProductSuggestionCreateDto dto, IFormFile? image)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            string? imageBase64 = null;
            if (image != null && image.Length > 0)
            {
                using var ms = new MemoryStream();
                await image.CopyToAsync(ms);
                var bytes = ms.ToArray();
                imageBase64 = Convert.ToBase64String(bytes);
            }

            var userId = GetUserId();
            try
            {
                var result = await _suggestionService.CreateSuggestionAsync(userId, dto, imageBase64);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // ============================================================
        // GET: /api/ProductSuggestions
        // List suggestions (Admin only)
        // ============================================================
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetSuggestions([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? status = null)
        {
            var result = await _suggestionService.GetSuggestionsAsync(page, pageSize, status);
            return Ok(result);
        }

        // ============================================================
        // GET: /api/ProductSuggestions/{id}
        // Get suggestion details (Admin only)
        // ============================================================
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetSuggestion(int id)
        {
            try
            {
                var suggestion = await _suggestionService.GetSuggestionByIdAsync(id);
                return Ok(suggestion);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // ============================================================
        // PUT: /api/ProductSuggestions/{id}/approve
        // Approve suggestion and create product (Admin only)
        // ============================================================
        [HttpPut("{id}/approve")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ApproveSuggestion(int id, [FromBody] SuggestionActionDto dto)
        {
            try
            {
                var adminId = GetUserId();
                var result = await _suggestionService.ApproveSuggestionAsync(adminId, id, dto.AdminNote);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // ============================================================
        // PUT: /api/ProductSuggestions/{id}/reject
        // Reject suggestion (Admin only)
        // ============================================================
        [HttpPut("{id}/reject")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RejectSuggestion(int id, [FromBody] SuggestionActionDto dto)
        {
            try
            {
                var adminId = GetUserId();
                var result = await _suggestionService.RejectSuggestionAsync(adminId, id, dto.AdminNote);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}