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
            settings = new StoreSetting
            {
                StoreName = "Prime",
                Address = "123 Prime Street",
                Location = "Downtown",
                OwnersJson = "[]",
                MobileNumbersJson = "[]",
                EmailsJson = "[]",
                Landline = "",
                WhatsApp = "",
                Template = "standard"
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
            Owners = JsonSerializer.Deserialize<List<OwnerDto>>(settings.OwnersJson) ?? new(),
            MobileNumbers = JsonSerializer.Deserialize<List<string>>(settings.MobileNumbersJson) ?? new(),
            Emails = JsonSerializer.Deserialize<List<string>>(settings.EmailsJson) ?? new(),
            Landline = settings.Landline,
            WhatsApp = settings.WhatsApp,
            Template = settings.Template   // ✅ MUST be this
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
        settings.Template = dto.Template;   // ✅ MUST save this

        await _context.SaveChangesAsync();

        return new StoreSettingDto
        {
            Id = settings.Id,
            StoreName = settings.StoreName,
            Address = settings.Address,
            Location = settings.Location,
            Owners = JsonSerializer.Deserialize<List<OwnerDto>>(settings.OwnersJson) ?? new(),
            MobileNumbers = JsonSerializer.Deserialize<List<string>>(settings.MobileNumbersJson) ?? new(),
            Emails = JsonSerializer.Deserialize<List<string>>(settings.EmailsJson) ?? new(),
            Landline = settings.Landline,
            WhatsApp = settings.WhatsApp,
            Template = settings.Template   // ✅ MUST return this
        };
    }
}