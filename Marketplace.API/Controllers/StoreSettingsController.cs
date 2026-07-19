using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Marketplace.Application.DTOs;
using Marketplace.Application.Interfaces;

namespace Marketplace.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StoreSettingsController : ControllerBase
{
    private readonly IStoreSettingService _settingsService;

    public StoreSettingsController(IStoreSettingService settingsService)
    {
        _settingsService = settingsService;
    }

    [HttpGet]
    public async Task<IActionResult> GetSettings()
    {
        var settings = await _settingsService.GetSettingsAsync();
        return Ok(settings);
    }

    [HttpPut]
    [Authorize(Roles = "Admin")] // Only Admins can update
    public async Task<IActionResult> UpdateSettings(StoreSettingDto dto)
    {
        var updated = await _settingsService.UpdateSettingsAsync(dto);
        return Ok(updated);
    }
}