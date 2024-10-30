using BikeBuddy.Application.DtoModels.Auth;
using CSharpFunctionalExtensions;
using Microsoft.AspNetCore.Http;

namespace BikeBuddy.Infrastructure.Services.Auth.Google;

public interface IGoogleService
{
    Task<Result<AuthResponse, string>> Login(string credential, HttpContext httpContext, CancellationToken cancellationToken);
}
