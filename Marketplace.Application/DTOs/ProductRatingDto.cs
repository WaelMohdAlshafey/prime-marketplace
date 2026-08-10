using System;

namespace Marketplace.Application.DTOs
{
    public class ProductRatingDto
    {
        public int Rating { get; set; } // 1-5
        public string? Review { get; set; }
    }

    public class ProductReviewResponseDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public int Rating { get; set; }
        public string? Review { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}