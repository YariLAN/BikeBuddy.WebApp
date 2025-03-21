using BikeBuddy.Application.DtoModels.User.Auth;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;
using Microsoft.AspNetCore.Http;

namespace BikeBuddy.Application.Services.Auth.Refresh;

public interface IRefreshService
{
    Task<Result<AuthResponse, Error>> ExecuteAsync(HttpContext httpContext, CancellationToken token);
}
