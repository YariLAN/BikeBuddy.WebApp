using System.Security.Claims;

namespace BikeBuddy.Application.Services.Auth;

public interface IJwtProvider
{
    string GenerateAccessToken(IEnumerable<Claim> authClaims, DateTime expiresAt);

    string GenerateRefreshToken();
}
