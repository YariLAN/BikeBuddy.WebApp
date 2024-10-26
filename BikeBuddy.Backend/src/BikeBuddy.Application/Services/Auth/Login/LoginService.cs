﻿using BikeBuddy.Application.DtoModels.Auth;
using BikeBuddy.Application.Mappers.Auth;
using BikeBuddy.Domain.Models.AuthControl;
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

    public LoginService(
        IAuthRepository authRepository, 
        IJwtProvider jwtProvider, 
        IPasswordHasher passwordHasher,
        IRefreshTokensRepository refreshTokensRepository)
    {
        _authRepository = authRepository;
        _jwtProvider = jwtProvider;
        _passwordHasher = passwordHasher;
        _refreshTokensRepository = refreshTokensRepository;
    }

    public async Task<Result<AuthResponse, string>> ExecuteAsync(LoginRequest request, HttpContext httpContext, CancellationToken token)
    {
        var user = await _authRepository.GetByEmailOrUsernamesAsync(request.Login, token);

        if (user is null || !_passwordHasher.Verify(request.Password, user.PasswordHash))
        {
            return "Неверный логин или пароль";
        }
        else if (!httpContext.User.Identity!.IsAuthenticated)
        {
            List<Claim> authClaims = new() {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName!)
            };

            var expiresAt = DateTime.UtcNow.AddMinutes(3);

            var (accessToken, refreshToken) = (
                _jwtProvider.GenerateAccessToken(authClaims, expiresAt),
                _jwtProvider.GenerateRefreshToken()
            );

            httpContext.Response.Cookies.Append("refresh", refreshToken);

            await _refreshTokensRepository.Create(
                UserRefreshTokenMapper.ToMap(user.Id, refreshToken, expiresAt), token);

            return new AuthResponse(accessToken, expiresAt);
        }

        return new();
    }
}