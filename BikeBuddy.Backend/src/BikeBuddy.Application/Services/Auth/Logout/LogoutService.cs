using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;
using Microsoft.AspNetCore.Http;

namespace BikeBuddy.Application.Services.Auth.Logout;

public class LogoutService : ILogoutService
{
    private readonly IRefreshTokensRepository _refreshTokensRepository;
    private readonly IAuthRepository _authRepository;
    private readonly IJwtProvider _jwtProvider;

    public LogoutService(IRefreshTokensRepository refreshTokensRepository, IJwtProvider jwtProvider, IAuthRepository authRepository)
    {
        _refreshTokensRepository = refreshTokensRepository;
        _jwtProvider = jwtProvider;
        _authRepository = authRepository;
    }

    public async Task<Result<bool, Error>> ExecuteAsync(HttpContext httpContext, CancellationToken cancellationToken)
    {
        var (accessToken, refreshToken) = (
             httpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", ""),
             httpContext.Request.Cookies["refresh"]
         );

        if (string.IsNullOrEmpty(accessToken) || string.IsNullOrEmpty(refreshToken))
            return Error.UnAuthorized("Invalid Refresh Token");

        var principal = _jwtProvider.GetPrincipalFromAccessToken(accessToken);

        if (principal is null)
            return Error.UnAuthorized("Invalid Access Token");

        var userId = _jwtProvider.GetUserIdFromClaims(principal);
        if (!userId.HasValue)
            return Error.UnAuthorized("Invalid Access Token");

        var isUpdate = await _authRepository.UpdateLastLoginAtAsync(userId.Value, cancellationToken);

        if (!isUpdate)
            return Error.NotFound("User is not found");

        var result = await _refreshTokensRepository.Delete(userId.Value, refreshToken, cancellationToken);

        if (!result) return Error.NotFound("Refresh Token is not found");

        httpContext.Response.Cookies.Delete("refresh");

        return result;
    }
}
