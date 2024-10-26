namespace BikeBuddy.Domain.Models.AuthControl;

public class UserRefreshToken
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public string RefreshToken { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public DateTime ExpiresAt { get; set; }

    public AuthUser AuthUser { get; set; } = default!;
}