using Marketplace.Application.DTOs;

namespace Marketplace.Application.Interfaces;

public interface INewsletterService
{
    Task SubscribeAsync(string email);
}