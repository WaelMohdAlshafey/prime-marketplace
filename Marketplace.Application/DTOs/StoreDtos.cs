using System;

namespace Marketplace.Application.DTOs
{
    public class StoreCreateDto
    {
        public string Name { get; set; } = string.Empty;
        public string? LogoUrl { get; set; }
        public string? Description { get; set; }
        public int VendorId { get; set; } // The user ID of the vendor who owns the store
    }

    public class StoreUpdateDto
    {
        public string Name { get; set; } = string.Empty;
        public string? LogoUrl { get; set; }
        public string? Description { get; set; }
        public bool IsActive { get; set; }
    }

    public class StoreResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? LogoUrl { get; set; }
        public string? Description { get; set; }
        public int VendorId { get; set; }
        public string VendorUsername { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public int ProductCount { get; set; } // Number of products in this store
    }
}