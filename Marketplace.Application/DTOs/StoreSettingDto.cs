namespace Marketplace.Application.DTOs;

public class StoreSettingDto
{
    public int Id { get; set; }

    // Basic Info
    public string StoreName { get; set; } = "Prime";
    public string Address { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public List<OwnerDto> Owners { get; set; } = new();
    public List<string> MobileNumbers { get; set; } = new();
    public List<string> Emails { get; set; } = new();
    public string Landline { get; set; } = string.Empty;
    public string WhatsApp { get; set; } = string.Empty;
    public string Template { get; set; } = "standard";

    // Theme Colors
    public string? PrimaryColor { get; set; }
    public string? PrimaryLight { get; set; }
    public string? PrimaryDark { get; set; }
    public string? SecondaryColor { get; set; }
    public string? SecondaryLight { get; set; }
    public string? BackgroundColor { get; set; }
    public string? SurfaceColor { get; set; }
    public string? TextColor { get; set; }
    public string? TextMuted { get; set; }

    // Navbar & Footer
    public string? NavbarBg { get; set; }
    public string? NavbarText { get; set; }
    public string? NavbarHover { get; set; }
    public string? FooterBg { get; set; }
    public string? FooterText { get; set; }

    // Buttons
    public string? ButtonPrimaryBg { get; set; }
    public string? ButtonPrimaryHover { get; set; }
    public string? ButtonPrimaryText { get; set; }
    public string? ButtonSecondaryBg { get; set; }
    public string? ButtonSecondaryHover { get; set; }
    public string? ButtonSecondaryText { get; set; }

    // Cards
    public string? CardBg { get; set; }
    public string? CardBorder { get; set; }
    public string? CardShadow { get; set; }
    public string? CardHoverShadow { get; set; }
    public string? CardBorderRadius { get; set; }

    // Fonts
    public string? FontFamily { get; set; }
    public string? HeadingFont { get; set; }
    public string? BodyFont { get; set; }

    // Emojis
    public string? SiteEmoji { get; set; }
    public string? FaviconEmoji { get; set; }

    // Advanced
    public string? CustomCss { get; set; }
    public string? CustomHeaderHtml { get; set; }
    public string? CustomFooterHtml { get; set; }
}

public class OwnerDto
{
    public string Name { get; set; } = string.Empty;
}