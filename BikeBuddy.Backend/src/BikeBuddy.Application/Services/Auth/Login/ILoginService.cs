using BikeBuddy.Application.DtoModels.Auth;
using CSharpFunctionalExtensions;
using Microsoft.AspNetCore.Http;

namespace BikeBuddy.Application.Services.Auth.Login;

public interface ILoginService
{
    Task<Result<AuthResponse, string>> ExecuteAsync(LoginRequest request, HttpContext httpContext, CancellationToken token);
}
