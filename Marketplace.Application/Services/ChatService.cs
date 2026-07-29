using Microsoft.EntityFrameworkCore;
using Marketplace.Application.DTOs;
using Marketplace.Application.Interfaces;
using Marketplace.Domain.Entities;
using Marketplace.Infrastructure.Data;

namespace Marketplace.Application.Services;

public class ChatService : IChatService
{
    private readonly AppDbContext _context;

    public ChatService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<UserDto>> GetAvailableUsersAsync(int currentUserId)
    {
        return await _context.Users
            .Where(u => u.Id != currentUserId)
            .Select(u => new UserDto
            {
                Id = u.Id,
                Username = u.Username,
                Role = u.Role
            })
            .ToListAsync();
    }

    public async Task<List<ConversationDto>> GetConversationsAsync(int userId)
    {
        var conversations = await _context.Conversations
            .Where(c => c.UserId1 == userId || c.UserId2 == userId)
            .Include(c => c.User1)
            .Include(c => c.User2)
            .Include(c => c.Messages.OrderByDescending(m => m.SentAt).Take(1))
            .OrderByDescending(c => c.LastMessageAt ?? c.CreatedAt)
            .ToListAsync();

        return conversations.Select(c =>
        {
            var otherUser = c.UserId1 == userId ? c.User2 : c.User1;
            var lastMsg = c.Messages.FirstOrDefault();
            return new ConversationDto
            {
                Id = c.Id,
                OtherUserId = otherUser!.Id,
                OtherUserName = otherUser.Username,
                OtherUserRole = otherUser.Role,
                LastMessageAt = c.LastMessageAt,
                LastMessageContent = lastMsg?.Content
            };
        }).ToList();
    }

    public async Task<List<MessageDto>> GetMessagesAsync(int conversationId, int userId)
    {
        var conversation = await _context.Conversations
            .FirstOrDefaultAsync(c => c.Id == conversationId && (c.UserId1 == userId || c.UserId2 == userId));
        if (conversation == null)
            throw new Exception("Conversation not found.");

        var messages = await _context.Messages
            .Where(m => m.ConversationId == conversationId)
            .Include(m => m.Sender)
            .OrderBy(m => m.SentAt)
            .ToListAsync();

        // Mark messages as read (optional)
        // You can implement read receipts here.

        return messages.Select(m => new MessageDto
        {
            Id = m.Id,
            SenderId = m.SenderId,
            SenderName = m.Sender?.Username ?? "Unknown",
            Content = m.Content,
            SentAt = m.SentAt,
            IsRead = m.IsRead
        }).ToList();
    }

    public async Task<ConversationDto> StartConversationAsync(int userId1, int userId2)
    {
        if (userId1 == userId2)
            throw new Exception("Cannot start conversation with yourself.");

        var existing = await _context.Conversations
            .FirstOrDefaultAsync(c =>
                (c.UserId1 == userId1 && c.UserId2 == userId2) ||
                (c.UserId1 == userId2 && c.UserId2 == userId1));
        if (existing != null)
        {
            // Return existing conversation
            return await GetConversationDto(existing, userId1);
        }

        var conversation = new Conversation
        {
            UserId1 = userId1,
            UserId2 = userId2,
            CreatedAt = DateTime.UtcNow,
            LastMessageAt = null
        };
        _context.Conversations.Add(conversation);
        await _context.SaveChangesAsync();

        return await GetConversationDto(conversation, userId1);
    }

    public async Task<MessageDto> SendMessageAsync(int conversationId, int senderId, string content)
    {
        var conversation = await _context.Conversations
            .FirstOrDefaultAsync(c => c.Id == conversationId && (c.UserId1 == senderId || c.UserId2 == senderId));
        if (conversation == null)
            throw new Exception("Conversation not found.");

        var message = new Message
        {
            ConversationId = conversationId,
            SenderId = senderId,
            Content = content,
            SentAt = DateTime.UtcNow,
            IsRead = false
        };
        _context.Messages.Add(message);
        conversation.LastMessageAt = message.SentAt;
        await _context.SaveChangesAsync();

        var sender = await _context.Users.FindAsync(senderId);
        return new MessageDto
        {
            Id = message.Id,
            SenderId = message.SenderId,
            SenderName = sender?.Username ?? "Unknown",
            Content = message.Content,
            SentAt = message.SentAt,
            IsRead = message.IsRead
        };
    }

    private async Task<ConversationDto> GetConversationDto(Conversation conv, int currentUserId)
    {
        var otherUser = conv.UserId1 == currentUserId ? conv.User2 : conv.User1;
        var lastMsg = await _context.Messages
            .Where(m => m.ConversationId == conv.Id)
            .OrderByDescending(m => m.SentAt)
            .FirstOrDefaultAsync();

        return new ConversationDto
        {
            Id = conv.Id,
            OtherUserId = otherUser!.Id,
            OtherUserName = otherUser.Username,
            OtherUserRole = otherUser.Role,
            LastMessageAt = conv.LastMessageAt,
            LastMessageContent = lastMsg?.Content
        };
    }
}