using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Marketplace.Application.DTOs;
using Marketplace.Application.Interfaces;

namespace Marketplace.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StoresController : ControllerBase
    {
        private readonly IStoreService _storeService;

        public StoresController(IStoreService storeService)
        {
            _storeService = storeService;
        }

        // ============================================================
        // PUBLIC – Get all stores (active only)
        // ============================================================
        [HttpGet]
        public async Task<IActionResult> GetStores([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var result = await _storeService.GetAllStoresAsync(page, pageSize, isActive: true);
            return Ok(result);
        }

        // ============================================================
        // PUBLIC – Get a single store by ID
        // ============================================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetStore(int id)
        {
            try
            {
                var store = await _storeService.GetStoreByIdAsync(id);
                return Ok(store);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // ============================================================
        // PUBLIC – Get products of a store
        // ============================================================
        [HttpGet("{id}/products")]
        public async Task<IActionResult> GetStoreProducts(int id, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            try
            {
                var result = await _storeService.GetStoreProductsAsync(id, page, pageSize);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // ============================================================
        // ADMIN ONLY – Create a store
        // ============================================================
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateStore(StoreCreateDto dto)
        {
            try
            {
                var result = await _storeService.CreateStoreAsync(dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // ============================================================
        // ADMIN ONLY – Update a store
        // ============================================================
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStore(int id, StoreUpdateDto dto)
        {
            try
            {
                var result = await _storeService.UpdateStoreAsync(id, dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // ============================================================
        // ADMIN ONLY – Delete a store (soft delete)
        // ============================================================
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteStore(int id)
        {
            try
            {
                await _storeService.DeleteStoreAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}