using Microsoft.AspNetCore.Mvc;
using Marketplace.Application.Interfaces;

namespace Marketplace.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NewsletterController : ControllerBase
{
    private readonly INewsletterService _newsletterService;

    public NewsletterController(INewsletterService newsletterService)
    {
        _newsletterService = newsletterService;
    }

    [HttpPost("subscribe")]
    public async Task<IActionResult> Subscribe([FromBody] SubscribeRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
            return BadRequest(new { message = "Email is required." });

        try
        {
            await _newsletterService.SubscribeAsync(request.Email);
            return Ok(new { message = "Subscription successful!" });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}

public class SubscribeRequest
{
    public string Email { get; set; } = string.Empty;
}