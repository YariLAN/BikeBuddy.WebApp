namespace BikeBuddy.Domain.Models;

public interface ICreatedUpdateAt
{
    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
