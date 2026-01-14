using BikeBuddy.Application.Services.Common.S3;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;
using Microsoft.AspNetCore.Http;
using static BikeBuddy.Domain.Shared.Files;

namespace BikeBuddy.Application.Services.Event.UploadMapService;

public sealed class UploadMapService(IS3Provider fileProvider) : IUploadMapService
{
    public async Task<Result<string, Error>> ExecuteAsync(Guid eventId, IFormFile file, CancellationToken cancellationToken)
    {
        var resutUpload = await fileProvider.UploadFileAsync(
            file,
            BucketNameConstants.EVENT_IMAGES,
            $"{eventId}/{FileNameConstants.MAP_IMAGE_FILENAME}",
            TypeMIME.IMAGE_PNG,
            cancellationToken);

        if (resutUpload.IsFailure)
            return resutUpload.Error;

        return resutUpload.Value;
    }
}
