using System;

namespace Marketplace.Domain.Entities
{
    public class Page
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string? Content { get; set; }
        public string? MetaDescription { get; set; }
        public string? MetaKeywords { get; set; }
        public bool IsPublished { get; set; } = true;
        public bool ShowInFooter { get; set; }
        public bool ShowInNavbar { get; set; }
        public int? DisplayOrder { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public int? CreatedByUserId { get; set; }
        public int? UpdatedByUserId { get; set; }

        // ✅ NEW
        public int? PageClassId { get; set; }
        public string? CssClass { get; set; }
        public virtual PageClass? PageClass { get; set; }

        public virtual User? CreatedBy { get; set; }
        public virtual User? UpdatedBy { get; set; }
    }
}