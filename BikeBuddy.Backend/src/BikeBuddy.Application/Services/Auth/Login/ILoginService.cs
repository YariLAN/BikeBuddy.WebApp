using BikeBuddy.Application.DtoModels.Auth;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;
using Microsoft.AspNetCore.Http;

namespace BikeBuddy.Application.Services.Auth.Login;

public interface ILoginService
{
    Task<Result<AuthResponse, Error>> ExecuteAsync(LoginRequest request, HttpContext httpContext, CancellationToken token);
}
