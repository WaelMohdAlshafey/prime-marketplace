namespace Marketplace.Domain.Entities;

public class Conversation
{
    public int Id { get; set; }
    public int UserId1 { get; set; } // The first participant
    public int UserId2 { get; set; } // The second participant
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastMessageAt { get; set; }

    // Navigation
    public virtual User? User1 { get; set; }
    public virtual User? User2 { get; set; }
    public virtual ICollection<Message> Messages { get; set; } = new List<Message>();
}