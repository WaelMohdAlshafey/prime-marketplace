using System;

namespace Marketplace.Application.DTOs;

public class GenerateGoldenLinkResponseDto
{
	public string Token { get; set; } = string.Empty;
	public string Link { get; set; } = string.Empty;
	public DateTime ExpiresAt { get; set; }
	public int UserId { get; set; }
	public string UserName { get; set; } = string.Empty;
	public string? RedirectPath { get; set; } = "/";
}