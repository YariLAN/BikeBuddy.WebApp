using BikeBuddy.Application.Options;
using BikeBuddy.Application.Services.Auth;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace BikeBuddy.Infrastructure.Services.Auth;

public class JwtProvider : IJwtProvider
{
    private readonly JwtOptions _jwtOptions;
    private readonly JwtBearerOptions _jwtBearerOptions;

    public JwtProvider(IOptions<JwtOptions> jwtOptions, IOptions<JwtBearerOptions> jwtBearerOptions)
    {
        _jwtOptions = jwtOptions.Value;
        _jwtBearerOptions = jwtBearerOptions.Value;
    }

    public string GenerateAccessToken(IEnumerable<Claim> authClaims, DateTime expiresAt)
    {
        var signingCredentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.SecretKey)),
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            claims: authClaims,
            signingCredentials: signingCredentials,
            expires: expiresAt);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public (string, DateTime) GenerateAccessToken(IEnumerable<Claim> authClaims)
    {
        // Убрать AddMinutes на AddHours
        var expiresAt = DateTime.UtcNow.AddMinutes(_jwtOptions.ExpiresHours);
        var token = GenerateAccessToken(authClaims, expiresAt);

        return (token, expiresAt);
    }

    public string GenerateRefreshToken()
    {
        var randNumber = new byte[64];

        using var rng = RandomNumberGenerator.Create();

        rng.GetBytes(randNumber);

        return Convert.ToBase64String(randNumber);
    }

    public ClaimsPrincipal? GetPrincipalFromAccessToken(string accessToken)
    {
        var validateParam = _jwtBearerOptions.TokenValidationParameters.Clone();
        validateParam.ValidateLifetime = false;

        var principal = new JwtSecurityTokenHandler().ValidateToken(accessToken, validateParam, out SecurityToken securityToken);

        var jwtSecurityToken = (securityToken as JwtSecurityToken);
        if (jwtSecurityToken is null ||
            !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
        {
            return null;
        }

        return principal;
    }

    public Guid? GetUserIdFromClaims(ClaimsPrincipal claimsPrincipal)
    {
        var userId = claimsPrincipal.FindFirstValue(ClaimTypes.NameIdentifier) ?? claimsPrincipal.FindFirstValue("userId");

        return userId is not null ? new Guid(userId) : null;
    }
}
