using BikeBuddy.Application.DtoModels.Auth;
using BikeBuddy.Application.Mappers.Auth;
using CSharpFunctionalExtensions;
using Microsoft.AspNetCore.Http;

namespace BikeBuddy.Application.Services.Auth.Refresh;

public class RefreshService : IRefreshService
{
    private readonly IRefreshTokensRepository _refreshTokensRepository;
    private readonly IJwtProvider _jwtProvider;

    public RefreshService(IRefreshTokensRepository refreshTokensRepository, IJwtProvider jwtProvider)
    {
        _refreshTokensRepository = refreshTokensRepository;
        _jwtProvider = jwtProvider;
    }

    public async Task<Result<AuthResponse, string>> ExecuteAsync(HttpContext httpContext, CancellationToken cancellationToken)
    {
        var (accessToken, refreshToken) = (
            httpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", ""),
            httpContext.Request.Cookies["refresh"]
        );

        if (string.IsNullOrEmpty(accessToken) || string.IsNullOrEmpty(refreshToken))
            return "Forbidden";

        var principal = _jwtProvider.GetPrincipalFromAccessToken(accessToken);

        if (principal is null)
            return "Invalid Access Token";

        var userId = _jwtProvider.GetUserIdFromClaims(principal);
        if (!userId.HasValue)
            return "Invalid Access Token";

        var dbRefreshToken = await _refreshTokensRepository.Get(userId.Value, refreshToken, cancellationToken);
        if (dbRefreshToken is null)
            return "Forbidden";

        if (dbRefreshToken.ExpiresAt < DateTime.UtcNow)
        {
            httpContext.Response.Cookies.Delete("refresh");

            return "Refresh Token expires";
        }

        var (token, expiresAt) = _jwtProvider.GenerateAccessToken(principal.Claims);
        var newRefreshToken = _jwtProvider.GenerateRefreshToken();

        var result = await _refreshTokensRepository.Create(
            UserRefreshTokenMapper.ToMap(Guid.NewGuid(), userId.Value, newRefreshToken, expiresAt.AddHours(12)), cancellationToken);

        await _refreshTokensRepository.Delete(userId.Value, dbRefreshToken.RefreshToken, cancellationToken);

        httpContext.Response.Cookies.Append("refresh", newRefreshToken, new() { HttpOnly = true });

        return new AuthResponse(token, expiresAt);
    }
}
