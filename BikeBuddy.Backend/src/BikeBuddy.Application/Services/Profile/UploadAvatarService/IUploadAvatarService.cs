using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;
using Microsoft.AspNetCore.Http;

namespace BikeBuddy.Application.Services.Profile.UploadAvatarService;

public interface IUploadAvatarService
{
    Task<Result<string, Error>> ExecuteAsync(Guid userId, IFormFile file, CancellationToken cancellationToken);
}
