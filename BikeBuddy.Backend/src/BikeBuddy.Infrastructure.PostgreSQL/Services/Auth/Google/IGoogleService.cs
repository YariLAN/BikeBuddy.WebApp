using System.Security.Claims;
using BikeBuddy.Application.DtoModels.User.Auth;
using CSharpFunctionalExtensions;
using Microsoft.AspNetCore.Http;

namespace BikeBuddy.Infrastructure.Services.Auth.Google;

public interface IGoogleService
{
    Task<Result<AuthResponse, string>> Login(ClaimsPrincipal principal, HttpContext httpContext, CancellationToken cancellationToken);
}
