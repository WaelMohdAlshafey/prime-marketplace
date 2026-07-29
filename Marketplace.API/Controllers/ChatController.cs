using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Marketplace.Application.DTOs;
using Marketplace.Application.Interfaces;

namespace Marketplace.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ChatController : ControllerBase
{
    private readonly IChatService _chatService;

    public ChatController(IChatService chatService)
    {
        _chatService = chatService;
    }

    private int GetUserId()
    {
        var claim = User.FindFirst("VendorId") ?? User.FindFirst(ClaimTypes.NameIdentifier);
        return int.Parse(claim!.Value);
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        var userId = GetUserId();
        var users = await _chatService.GetAvailableUsersAsync(userId);
        return Ok(users);
    }

    [HttpGet("conversations")]
    public async Task<IActionResult> GetConversations()
    {
        var userId = GetUserId();
        var conversations = await _chatService.GetConversationsAsync(userId);
        return Ok(conversations);
    }

    [HttpGet("conversations/{id}/messages")]
    public async Task<IActionResult> GetMessages(int id)
    {
        var userId = GetUserId();
        var messages = await _chatService.GetMessagesAsync(id, userId);
        return Ok(messages);
    }

    [HttpPost("conversations")]
    public async Task<IActionResult> StartConversation([FromBody] StartConversationDto dto)
    {
        var userId = GetUserId();
        var conversation = await _chatService.StartConversationAsync(userId, dto.UserId);
        return Ok(conversation);
    }

    [HttpPost("conversations/{id}/messages")]
    public async Task<IActionResult> SendMessage(int id, [FromBody] SendMessageDto dto)
    {
        var userId = GetUserId();
        var message = await _chatService.SendMessageAsync(id, userId, dto.Content);
        return Ok(message);
    }
}

public class StartConversationDto
{
    public int UserId { get; set; }
}

public class SendMessageDto
{
    public string Content { get; set; } = string.Empty;
}