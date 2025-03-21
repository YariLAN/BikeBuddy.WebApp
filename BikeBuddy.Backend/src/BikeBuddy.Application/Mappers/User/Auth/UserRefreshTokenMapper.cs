using BikeBuddy.Domain.Models.AuthControl;

namespace BikeBuddy.Application.Mappers.User.Auth;

public static class UserRefreshTokenMapper
{
    public static UserRefreshToken ToMap(Guid id, Guid userId, string refreshToken, DateTime expiresAt)
    {
        return new()
        {
            Id = id,
            RefreshToken = refreshToken,
            UserId = userId,
            ExpiresAt = expiresAt,
            CreatedAt = DateTime.UtcNow
        };
    }
}
