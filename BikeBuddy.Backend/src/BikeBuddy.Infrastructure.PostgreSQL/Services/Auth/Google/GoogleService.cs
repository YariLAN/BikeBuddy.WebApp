using BikeBuddy.Application.DtoModels.User.Auth;
using BikeBuddy.Application.Mappers.User.Auth;
using BikeBuddy.Application.Services.Auth;
using CSharpFunctionalExtensions;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace BikeBuddy.Infrastructure.Services.Auth.Google;

public class GoogleService : IGoogleService
{
    private readonly IAuthRepository _authRepository;
    private readonly IRefreshTokensRepository _refreshTokensRepository;
    private readonly IJwtProvider _jwtProvider;

    public GoogleService(
        IRefreshTokensRepository refreshTokensRepository,
        IJwtProvider jwtProvider, 
        IAuthRepository authRepository)
    {
        _refreshTokensRepository = refreshTokensRepository;
        _jwtProvider = jwtProvider;
        _authRepository = authRepository;
    }

    public async Task<Result<AuthResponse, string>> Login(ClaimsPrincipal principal, HttpContext httpContext,  CancellationToken cancellationToken)
    {
        var settings = new GoogleJsonWebSignature.ValidationSettings()
        {
            Audience = new List<string> { "" }
        };

        var email = principal.FindFirstValue(ClaimTypes.Email);

        var payload = await GoogleJsonWebSignature.ValidateAsync(email, settings);

        var user = await _authRepository.GetByUsernameAsync(payload.Name, cancellationToken);

        if (user is null)
            return "Invalid Login";
        else if (!httpContext.User.Identity!.IsAuthenticated)
        {
            List<Claim> authClaims = new() {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.UserName!)
                };
    
            var ((accessToken, expiresAt), refreshToken) = (
                _jwtProvider.GenerateAccessToken(authClaims),
                _jwtProvider.GenerateRefreshToken()
            );
    
            var expiresAtRefresh = expiresAt.AddHours(240);
    
            httpContext.Response.Cookies.Append("refresh", refreshToken);
    
            var result = await _refreshTokensRepository.Create(
                UserRefreshTokenMapper.ToMap(Guid.NewGuid(), user.Id, refreshToken, expiresAtRefresh), cancellationToken);
    
            if (!result)
                return "Не удалось сохранить refresToken";
    
            return new AuthResponse(accessToken, expiresAt);
        }

        return new();
    }
}
