using BikeBuddy.Application.DtoModels.Auth;
using CSharpFunctionalExtensions;
using Microsoft.AspNetCore.Http;

namespace BikeBuddy.Application.Services.Auth.Refresh;

public interface IRefreshService
{
    Task<Result<AuthResponse, string>> ExecuteAsync(HttpContext httpContext, CancellationToken token);
}
