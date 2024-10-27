
using BikeBuddy.Domain.Models.AuthControl;
using CSharpFunctionalExtensions;
using Microsoft.AspNetCore.Http;

namespace BikeBuddy.Application.Services.Auth.Logout;

public class LogoutService : ILogoutService
{
    private readonly IRefreshTokensRepository _refreshTokensRepository;
    private readonly IJwtProvider _jwtProvider;

    public LogoutService(IRefreshTokensRepository refreshTokensRepository, IJwtProvider jwtProvider)
    {
        _refreshTokensRepository = refreshTokensRepository;
        _jwtProvider = jwtProvider;
    }

    public async Task<Result<bool, string>> ExecuteAsync(HttpContext httpContext, CancellationToken cancellationToken)
    {
        var (accessToken, refreshToken) = (
             httpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", ""),
             httpContext.Request.Cookies["refresh"]
         );

        if (string.IsNullOrEmpty(accessToken) || string.IsNullOrEmpty(refreshToken))
            return "Invalid Refresh Token";

        var principal = _jwtProvider.GetPrincipalFromAccessToken(accessToken);

        if (principal is null)
            return "Invalid Access Token";

        var userId = _jwtProvider.GetUserIdFromClaims(principal);
        if (!userId.HasValue)
            return "Invalid Access Token";

        var result = await _refreshTokensRepository.Delete(userId.Value, refreshToken, cancellationToken);

        if (!result) return "Invalid Refresh Token";

        httpContext.Response.Cookies.Delete("refresh");

        return result;
    }
}
