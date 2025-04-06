using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;
using Microsoft.AspNetCore.Http;

namespace BikeBuddy.Application.Services.Event.UploadMapService;

public interface IUploadMapService
{
    Task<Result<string, Error>> ExecuteAsync(Guid eventId, IFormFile file, CancellationToken cancellationToken);
}
