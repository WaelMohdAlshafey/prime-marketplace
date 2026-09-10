using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Marketplace.Application.DTOs;
using Marketplace.Application.Interfaces;

namespace Marketplace.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PageClassesController : ControllerBase
{
    private readonly IPageClassService _service;
    public PageClassesController(IPageClassService service) { _service = service; }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] bool onlyActive = false)
        => Ok(await _service.GetAllAsync(onlyActive));

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        try { return Ok(await _service.GetByIdAsync(id)); }
        catch (Exception ex) { return NotFound(new { message = ex.Message }); }
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreatePageClassDto dto)
    {
        try { return Ok(await _service.CreateAsync(dto)); }
        catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdatePageClassDto dto)
    {
        try { return Ok(await _service.UpdateAsync(id, dto)); }
        catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        try { await _service.DeleteAsync(id); return NoContent(); }
        catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
    }
}