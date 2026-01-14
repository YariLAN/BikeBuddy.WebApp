using BikeBuddy.Application.Services.Common.S3;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;
using Microsoft.AspNetCore.Http;

using static BikeBuddy.Domain.Shared.Files;

namespace BikeBuddy.Application.Services.Profile.UploadAvatarService;

public sealed class UploadAvatarService(IUserProfileRepository profileRepository, IS3Provider fileProvider) : IUploadAvatarService
{
    public async Task<Result<string, Error>> ExecuteAsync(Guid userId, IFormFile file, CancellationToken cancellationToken)
    {
        var profile = await profileRepository.GetByUserIdAsync(userId, cancellationToken);

        if (profile is null)
            return Errors.General.NotFound(userId);

        var objectName = $"{userId}/{file.FileName}";

        var resutUpload = await fileProvider.UploadFileAsync(
            file,
            BucketNameConstants.PROFILE_IMAGES,
            objectName,
            file.ContentType,
            cancellationToken);

        if (resutUpload.IsFailure) return resutUpload.Error;

        var url = await fileProvider.GetPermanentFileUrlAsync(
            objectName,
            BucketNameConstants.PROFILE_IMAGES, cancellationToken);

        if (url.IsFailure) return url.Error;

        profile.UpdatePhoto(url.Value);

        var resultUpdate = await profileRepository.UpdateAsync(profile, cancellationToken);
        if (resultUpdate.IsFailure)
            return resultUpdate.Error;

        return url.Value;
    }
}
