using BikeBuddy.Application.DtoModels.Profile;
using BikeBuddy.Application.Mappers.User.Profile;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;
using BikeBuddy.Application.Services.Common.S3;

namespace BikeBuddy.Application.Services.Profile.GetProfileService;

public sealed class GetProfileService(IUserProfileRepository _userProfileRepository, IS3Provider fileProvider) : IGetProfileService
{
    public async Task<Result<UserProfileResponse, Error>> ExecuteAsync(Guid userId, CancellationToken cancellationToken)
    {
        var dbProfile = await _userProfileRepository.GetByUserIdAsync(userId, cancellationToken);

        if (dbProfile is null)
            return Error.NotFound("Профиль не найден");

        return UserProfileMapper.ToMap(dbProfile);
    }
}
