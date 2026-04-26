using BikeBuddy.Application.DtoModels.Profile;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Application.Services.Profile.GetProfilesService;

public interface IGetProfilesService
{
    Task<Result<IReadOnlyList<UserProfileResponse>, Error>> ExecuteAsync(GetProfilesQuery query, CancellationToken cancellationToken);
}
