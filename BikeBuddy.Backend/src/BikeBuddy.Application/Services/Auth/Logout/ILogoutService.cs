using CSharpFunctionalExtensions;
using Microsoft.AspNetCore.Http;

namespace BikeBuddy.Application.Services.Auth.Logout;

public interface ILogoutService
{
    Task<Result<bool, string>> ExecuteAsync(HttpContext httpContext,  CancellationToken cancellationToken);
}
