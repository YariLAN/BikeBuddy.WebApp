using System.Security.Claims;

namespace BikeBuddy.Application.Services.Auth;

public interface IJwtProvider
{
    string GenerateAccessToken(IEnumerable<Claim> authClaims, DateTime expiresAt);

    (string, DateTime) GenerateAccessToken(IEnumerable<Claim> authClaims);

    string GenerateRefreshToken();

    ClaimsPrincipal? GetPrincipalFromAccessToken(string accessToken);

    Guid? GetUserIdFromClaims(ClaimsPrincipal claimsPrincipal);
}
