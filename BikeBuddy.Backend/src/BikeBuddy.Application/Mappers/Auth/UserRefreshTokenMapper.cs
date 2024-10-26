using BikeBuddy.Domain.Models.AuthControl;

namespace BikeBuddy.Application.Mappers.Auth;

public static class UserRefreshTokenMapper
{
    public static UserRefreshToken ToMap(Guid userId, string refreshToken, DateTime expiresAt)
    {
        return new()
        {
            RefreshToken = refreshToken,
            UserId = userId,
            ExpiresAt = expiresAt,
            CreatedAt = DateTime.UtcNow
        };
    }
}
