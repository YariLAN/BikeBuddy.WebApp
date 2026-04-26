using BikeBuddy.Application.DtoModels.Profile;
using BikeBuddy.Application.Mappers.User.Profile;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Application.Services.Profile.GetProfilesService;

public sealed class GetProfilesService(IUserProfileRepository userProfileRepository) : IGetProfilesService
{
    public async Task<Result<IReadOnlyList<UserProfileResponse>, Error>> ExecuteAsync(
        GetProfilesQuery query,
        CancellationToken cancellationToken)
    {
        var profiles = await userProfileRepository.GetAllAsync(cancellationToken);

        if (profiles.IsFailure)
            return profiles.Error;

        return new List<UserProfileResponse>(UserProfileMapper.ToMap(profiles.Value));
    }
}
