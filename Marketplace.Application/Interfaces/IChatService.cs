using Marketplace.Application.DTOs;

namespace Marketplace.Application.Interfaces;

public interface IChatService
{
    Task<List<UserDto>> GetAvailableUsersAsync(int currentUserId);
    Task<List<ConversationDto>> GetConversationsAsync(int userId);
    Task<List<MessageDto>> GetMessagesAsync(int conversationId, int userId);
    Task<ConversationDto> StartConversationAsync(int userId1, int userId2);
    Task<MessageDto> SendMessageAsync(int conversationId, int senderId, string content);
}