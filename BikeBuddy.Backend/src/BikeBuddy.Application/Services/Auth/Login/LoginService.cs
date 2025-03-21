using BikeBuddy.Application.DtoModels.User.Auth;
using BikeBuddy.Application.Mappers.User.Auth;
using BikeBuddy.Application.Services.Common;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace BikeBuddy.Application.Services.Auth.Login;

public class LoginService : ILoginService
{
    private readonly IAuthRepository _authRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtProvider _jwtProvider;
    private readonly IRefreshTokensRepository _refreshTokensRepository;
    private readonly ICookieProvider _cookieProvider;

    public LoginService(
        IAuthRepository authRepository,
        IJwtProvider jwtProvider,
        IPasswordHasher passwordHasher,
        IRefreshTokensRepository refreshTokensRepository,
        ICookieProvider cookieProvider)
    {
        _authRepository = authRepository;
        _jwtProvider = jwtProvider;
        _passwordHasher = passwordHasher;
        _refreshTokensRepository = refreshTokensRepository;
        _cookieProvider = cookieProvider;
    }

    public async Task<Result<AuthResponse, Error>> ExecuteAsync(LoginRequest request, HttpContext httpContext, CancellationToken token)
    {
        var user = await _authRepository.GetByEmailOrUsernamesAsync(request.Login, token);

        if (user is null || !_passwordHasher.Verify(request.Password, user.PasswordHash))
        {
            return Error.Validation("Неверный логин или пароль");
        }
        else if (!httpContext.User.Identity!.IsAuthenticated)
        {
            List<Claim> authClaims = new() {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email.ToString()),
                new Claim(ClaimTypes.Name, user.UserName!)
            };

            var ( (accessToken, expiresAt), refreshToken) = (
                _jwtProvider.GenerateAccessToken(authClaims),
                _jwtProvider.GenerateRefreshToken()
            );

            var expiresAtRefresh = expiresAt.AddHours(240);

            httpContext.Response.Cookies.Append("refresh", refreshToken, _cookieProvider.CreateCookieOptions(expiresAtRefresh));

            var result = await _refreshTokensRepository.Create(
                UserRefreshTokenMapper.ToMap(Guid.NewGuid(), user.Id, refreshToken, expiresAtRefresh), token);

            if (!result)
                return Error.Failure("Не удалось сохранить refresToken");

            return new AuthResponse(accessToken, expiresAt);
        }

        return new();
    }
}