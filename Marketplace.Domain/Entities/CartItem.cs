using System.ComponentModel.DataAnnotations.Schema;

namespace Marketplace.Domain.Entities;

public class CartItem
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int UserId { get; set; }
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    public DateTime AddedAt { get; set; } = DateTime.UtcNow;

    public virtual Product? Product { get; set; }
}