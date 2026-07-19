using Microsoft.EntityFrameworkCore;
using Marketplace.Application.DTOs;
using Marketplace.Application.Interfaces;
using Marketplace.Domain.Entities;
using Marketplace.Infrastructure.Data;
using System.Text.Json;

namespace Marketplace.Application.Services;

public class StoreSettingService : IStoreSettingService
{
    private readonly AppDbContext _context;

    public StoreSettingService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<StoreSettingDto> GetSettingsAsync()
    {
        var settings = await _context.StoreSettings.FirstOrDefaultAsync();
        if (settings == null)
        {
            // Create default settings if none exist
            settings = new StoreSetting
            {
                StoreName = "Prime",
                Address = "123 Prime Street, Business District, Cairo, Egypt",
                Location = "Downtown, near City Mall",
                OwnersJson = JsonSerializer.Serialize(new[] { new { name = "Ahmed Mohamed" }, new { name = "Sara Khaled" } }),
                MobileNumbersJson = JsonSerializer.Serialize(new[] { "+20 100 123 4567", "+20 101 234 5678" }),
                EmailsJson = JsonSerializer.Serialize(new[] { "support@primemarket.com", "info@primemarket.com" }),
                Landline = "+20 2 345 6789",
                WhatsApp = "+20 100 123 4567"
            };
            _context.StoreSettings.Add(settings);
            await _context.SaveChangesAsync();
        }

        return new StoreSettingDto
        {
            Id = settings.Id,
            StoreName = settings.StoreName,
            Address = settings.Address,
            Location = settings.Location,
            Owners = JsonSerializer.Deserialize<List<OwnerDto>>(settings.OwnersJson) ?? new List<OwnerDto>(),
            MobileNumbers = JsonSerializer.Deserialize<List<string>>(settings.MobileNumbersJson) ?? new List<string>(),
            Emails = JsonSerializer.Deserialize<List<string>>(settings.EmailsJson) ?? new List<string>(),
            Landline = settings.Landline,
            WhatsApp = settings.WhatsApp
        };
    }

    public async Task<StoreSettingDto> UpdateSettingsAsync(StoreSettingDto dto)
    {
        var settings = await _context.StoreSettings.FirstOrDefaultAsync();
        if (settings == null)
        {
            settings = new StoreSetting();
            _context.StoreSettings.Add(settings);
        }

        settings.StoreName = dto.StoreName;
        settings.Address = dto.Address;
        settings.Location = dto.Location;
        settings.OwnersJson = JsonSerializer.Serialize(dto.Owners);
        settings.MobileNumbersJson = JsonSerializer.Serialize(dto.MobileNumbers);
        settings.EmailsJson = JsonSerializer.Serialize(dto.Emails);
        settings.Landline = dto.Landline;
        settings.WhatsApp = dto.WhatsApp;

        await _context.SaveChangesAsync();

        return dto;
    }
}