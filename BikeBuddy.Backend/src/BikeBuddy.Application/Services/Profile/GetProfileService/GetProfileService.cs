using BikeBuddy.Application.DtoModels.Profile;
using BikeBuddy.Application.Mappers.Profile;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Application.Services.Profile.GetProfileService;

public class GetProfileService(IUserProfileRepository _userProfileRepository) : IGetProfileService
{
    public async Task<Result<UserProfileResponse, Error>> ExecuteAsync(Guid userId, CancellationToken cancellationToken)
    {
        var dbProfile = await _userProfileRepository.GetByUserIdAsync(userId, cancellationToken);

        if (dbProfile is null)
            return Error.NotFound("Профиль не найден");

        return UserProfileMapper.ToMap(dbProfile);
    }
}
