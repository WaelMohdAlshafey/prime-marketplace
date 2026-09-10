using System;

namespace Marketplace.Domain.Entities
{
    public class PageClass
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Icon { get; set; }
        public string? ColorClass { get; set; }
        public int? DisplayOrder { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public virtual ICollection<Page> Pages { get; set; } = new List<Page>();
    }
}