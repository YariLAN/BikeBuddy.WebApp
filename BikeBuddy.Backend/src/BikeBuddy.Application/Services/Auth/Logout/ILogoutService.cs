using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;
using Microsoft.AspNetCore.Http;

namespace BikeBuddy.Application.Services.Auth.Logout;

public interface ILogoutService
{
    Task<Result<bool, Error>> ExecuteAsync(HttpContext httpContext,  CancellationToken cancellationToken);
}
