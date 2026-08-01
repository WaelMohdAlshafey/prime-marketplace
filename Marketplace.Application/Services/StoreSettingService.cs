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
        // Get the first settings record, or create a default one if none exists
        var settings = await _context.StoreSettings.FirstOrDefaultAsync();

        if (settings == null)
        {
            // Return default settings if none exist in DB
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
                WhatsApp = settings.WhatsApp,
                Template = settings.Template   // ✅ ADD THIS
            };
        }

        // Map Entity to DTO
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
            // If no settings exist, create a new one
            settings = new StoreSetting();
            _context.StoreSettings.Add(settings);
        }

        // Update fields
        settings.StoreName = dto.StoreName;
        settings.Address = dto.Address;
        settings.Location = dto.Location;
        settings.OwnersJson = JsonSerializer.Serialize(dto.Owners);
        settings.MobileNumbersJson = JsonSerializer.Serialize(dto.MobileNumbers);
        settings.EmailsJson = JsonSerializer.Serialize(dto.Emails);
        settings.Landline = dto.Landline;
        settings.WhatsApp = dto.WhatsApp;
        settings.Template = dto.Template;   // ✅ ADD THIS
        await _context.SaveChangesAsync();

        return dto;
    }
}