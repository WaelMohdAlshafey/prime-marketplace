namespace Marketplace.Domain.Entities;

public class WishlistItem
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int ProductId { get; set; }

    public virtual User? User { get; set; }
    public virtual Product? Product { get; set; }
}