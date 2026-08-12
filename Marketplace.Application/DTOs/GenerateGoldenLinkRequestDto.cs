using System;

namespace Marketplace.Application.DTOs;

public class GenerateGoldenLinkRequestDto
{
    public int? UserId { get; set; }
    public int ExpiryDays { get; set; } = 7;
    public string? RedirectPath { get; set; } = "/";
}