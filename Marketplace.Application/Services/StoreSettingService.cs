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
            // Return default settings with theme values
            return new StoreSettingDto
            {
                StoreName = "Prime",
                Address = "123 Prime Street, Business District, Cairo, Egypt",
                Location = "Downtown, near City Mall",
                Owners = new List<OwnerDto> { new OwnerDto { Name = "Ahmed Mohamed" }, new OwnerDto { Name = "Sara Khaled" } },
                MobileNumbers = new List<string> { "+20 100 123 4567", "+20 101 234 5678" },
                Emails = new List<string> { "support@primemarket.com", "info@primemarket.com" },
                Landline = "+20 2 345 6789",
                WhatsApp = "+20 100 123 4567",
                Template = "standard",

                // Theme defaults
                PrimaryColor = "#0F5C45",
                PrimaryLight = "#1A7A5C",
                PrimaryDark = "#0A4735",
                SecondaryColor = "#D4A54A",
                SecondaryLight = "#E8C97A",
                BackgroundColor = "#F7F8FA",
                SurfaceColor = "#FFFFFF",
                TextColor = "#1A1A2E",
                TextMuted = "#6B7280",
                NavbarBg = "#0F5C45",
                NavbarText = "#FFFFFF",
                NavbarHover = "#D4A54A",
                FooterBg = "#111827",
                FooterText = "#9CA3AF",
                ButtonPrimaryBg = "#0F5C45",
                ButtonPrimaryHover = "#0A4735",
                ButtonPrimaryText = "#FFFFFF",
                ButtonSecondaryBg = "transparent",
                ButtonSecondaryHover = "#0F5C45",
                ButtonSecondaryText = "#0F5C45",
                CardBg = "#FFFFFF",
                CardBorder = "#E5E7EB",
                CardShadow = "0 8px 32px rgba(15, 92, 69, 0.08)",
                CardHoverShadow = "0 20px 60px rgba(15, 92, 69, 0.18)",
                CardBorderRadius = "16px",
                FontFamily = "Cairo, 'Inter', sans-serif",
                HeadingFont = "Cairo, sans-serif",
                BodyFont = "Cairo, sans-serif",
                SiteEmoji = "🛍️",
                FaviconEmoji = "🏪"
            };
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
            Template = settings.Template,

            // Theme values
            PrimaryColor = settings.PrimaryColor,
            PrimaryLight = settings.PrimaryLight,
            PrimaryDark = settings.PrimaryDark,
            SecondaryColor = settings.SecondaryColor,
            SecondaryLight = settings.SecondaryLight,
            BackgroundColor = settings.BackgroundColor,
            SurfaceColor = settings.SurfaceColor,
            TextColor = settings.TextColor,
            TextMuted = settings.TextMuted,
            NavbarBg = settings.NavbarBg,
            NavbarText = settings.NavbarText,
            NavbarHover = settings.NavbarHover,
            FooterBg = settings.FooterBg,
            FooterText = settings.FooterText,
            ButtonPrimaryBg = settings.ButtonPrimaryBg,
            ButtonPrimaryHover = settings.ButtonPrimaryHover,
            ButtonPrimaryText = settings.ButtonPrimaryText,
            ButtonSecondaryBg = settings.ButtonSecondaryBg,
            ButtonSecondaryHover = settings.ButtonSecondaryHover,
            ButtonSecondaryText = settings.ButtonSecondaryText,
            CardBg = settings.CardBg,
            CardBorder = settings.CardBorder,
            CardShadow = settings.CardShadow,
            CardHoverShadow = settings.CardHoverShadow,
            CardBorderRadius = settings.CardBorderRadius,
            FontFamily = settings.FontFamily,
            HeadingFont = settings.HeadingFont,
            BodyFont = settings.BodyFont,
            SiteEmoji = settings.SiteEmoji,
            FaviconEmoji = settings.FaviconEmoji,
            CustomCss = settings.CustomCss,
            CustomHeaderHtml = settings.CustomHeaderHtml,
            CustomFooterHtml = settings.CustomFooterHtml
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

        // Basic info
        settings.StoreName = dto.StoreName;
        settings.Address = dto.Address;
        settings.Location = dto.Location;
        settings.OwnersJson = JsonSerializer.Serialize(dto.Owners);
        settings.MobileNumbersJson = JsonSerializer.Serialize(dto.MobileNumbers);
        settings.EmailsJson = JsonSerializer.Serialize(dto.Emails);
        settings.Landline = dto.Landline;
        settings.WhatsApp = dto.WhatsApp;
        settings.Template = dto.Template;

        // Theme colors
        settings.PrimaryColor = dto.PrimaryColor;
        settings.PrimaryLight = dto.PrimaryLight;
        settings.PrimaryDark = dto.PrimaryDark;
        settings.SecondaryColor = dto.SecondaryColor;
        settings.SecondaryLight = dto.SecondaryLight;
        settings.BackgroundColor = dto.BackgroundColor;
        settings.SurfaceColor = dto.SurfaceColor;
        settings.TextColor = dto.TextColor;
        settings.TextMuted = dto.TextMuted;

        // Navbar & Footer
        settings.NavbarBg = dto.NavbarBg;
        settings.NavbarText = dto.NavbarText;
        settings.NavbarHover = dto.NavbarHover;
        settings.FooterBg = dto.FooterBg;
        settings.FooterText = dto.FooterText;

        // Buttons
        settings.ButtonPrimaryBg = dto.ButtonPrimaryBg;
        settings.ButtonPrimaryHover = dto.ButtonPrimaryHover;
        settings.ButtonPrimaryText = dto.ButtonPrimaryText;
        settings.ButtonSecondaryBg = dto.ButtonSecondaryBg;
        settings.ButtonSecondaryHover = dto.ButtonSecondaryHover;
        settings.ButtonSecondaryText = dto.ButtonSecondaryText;

        // Cards
        settings.CardBg = dto.CardBg;
        settings.CardBorder = dto.CardBorder;
        settings.CardShadow = dto.CardShadow;
        settings.CardHoverShadow = dto.CardHoverShadow;
        settings.CardBorderRadius = dto.CardBorderRadius;

        // Fonts
        settings.FontFamily = dto.FontFamily;
        settings.HeadingFont = dto.HeadingFont;
        settings.BodyFont = dto.BodyFont;

        // Emojis
        settings.SiteEmoji = dto.SiteEmoji;
        settings.FaviconEmoji = dto.FaviconEmoji;

        // Advanced
        settings.CustomCss = dto.CustomCss;
        settings.CustomHeaderHtml = dto.CustomHeaderHtml;
        settings.CustomFooterHtml = dto.CustomFooterHtml;

        await _context.SaveChangesAsync();

        return dto;
    }
}