namespace Marketplace.Domain.Entities;

public class StoreSetting
{
    public int Id { get; set; }

    // ============================================================
    // BASIC INFO (existing)
    // ============================================================
    public string StoreName { get; set; } = "Prime";
    public string Address { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string OwnersJson { get; set; } = "[]";
    public string MobileNumbersJson { get; set; } = "[]";
    public string EmailsJson { get; set; } = "[]";
    public string Landline { get; set; } = string.Empty;
    public string WhatsApp { get; set; } = string.Empty;
    public string Template { get; set; } = "standard";

    // ============================================================
    // THEME COLORS
    // ============================================================
    public string? PrimaryColor { get; set; }           // Main brand color
    public string? PrimaryLight { get; set; }           // Lighter shade
    public string? PrimaryDark { get; set; }            // Darker shade
    public string? SecondaryColor { get; set; }         // Accent color
    public string? SecondaryLight { get; set; }         // Lighter accent
    public string? BackgroundColor { get; set; }        // Page background
    public string? SurfaceColor { get; set; }           // Card/container background
    public string? TextColor { get; set; }              // Main text color
    public string? TextMuted { get; set; }              // Muted text color

    // ============================================================
    // NAVBAR & FOOTER
    // ============================================================
    public string? NavbarBg { get; set; }               // Navbar background
    public string? NavbarText { get; set; }             // Navbar text color
    public string? NavbarHover { get; set; }            // Navbar hover color
    public string? FooterBg { get; set; }               // Footer background
    public string? FooterText { get; set; }             // Footer text color

    // ============================================================
    // BUTTONS
    // ============================================================
    public string? ButtonPrimaryBg { get; set; }        // Primary button background
    public string? ButtonPrimaryHover { get; set; }     // Primary button hover
    public string? ButtonPrimaryText { get; set; }      // Primary button text
    public string? ButtonSecondaryBg { get; set; }      // Secondary button
    public string? ButtonSecondaryHover { get; set; }
    public string? ButtonSecondaryText { get; set; }

    // ============================================================
    // CARDS & SHADOWS
    // ============================================================
    public string? CardBg { get; set; }                 // Card background
    public string? CardBorder { get; set; }             // Card border color
    public string? CardShadow { get; set; }             // Card shadow (CSS value)
    public string? CardHoverShadow { get; set; }        // Card hover shadow
    public string? CardBorderRadius { get; set; }       // Card border radius (e.g., "16px")

    // ============================================================
    // FONTS & TYPOGRAPHY
    // ============================================================
    public string? FontFamily { get; set; }             // e.g., "Cairo, sans-serif"
    public string? HeadingFont { get; set; }            // Heading font
    public string? BodyFont { get; set; }               // Body font

    // ============================================================
    // EMOJI / SITE ICON
    // ============================================================
    public string? SiteEmoji { get; set; }              // e.g., "🛍️" or "✨"
    public string? FaviconEmoji { get; set; }           // e.g., "🏪"

    // ============================================================
    // ADVANCED / CUSTOM CSS
    // ============================================================
    public string? CustomCss { get; set; }              // Raw CSS overrides
    public string? CustomHeaderHtml { get; set; }       // Custom header HTML
    public string? CustomFooterHtml { get; set; }       // Custom footer HTML
}