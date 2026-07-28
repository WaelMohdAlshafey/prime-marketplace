using Microsoft.EntityFrameworkCore;
using Marketplace.Application.Interfaces;
using Marketplace.Domain.Entities;
using Marketplace.Infrastructure.Data;

namespace Marketplace.Application.Services;

public class NewsletterService : INewsletterService
{
    private readonly AppDbContext _context;

    public NewsletterService(AppDbContext context)
    {
        _context = context;
    }

    public async Task SubscribeAsync(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            throw new ArgumentException("Email is required.");

        // Check if already subscribed
        var exists = await _context.NewsletterSubscriptions
            .AnyAsync(ns => ns.Email == email && ns.IsActive);

        if (exists)
            throw new InvalidOperationException("This email is already subscribed.");

        var subscription = new NewsletterSubscription
        {
            Email = email,
            SubscribedAt = DateTime.UtcNow,
            IsActive = true
        };

        _context.NewsletterSubscriptions.Add(subscription);
        await _context.SaveChangesAsync();
    }
}