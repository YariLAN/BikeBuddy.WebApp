using BikeBuddy.Application.DtoModels.Profile;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Application.Services.Profile.GetProfileService;

public interface IGetProfileService
{
    Task<Result<UserProfileResponse, Error>> ExecuteAsync(Guid userId, CancellationToken cancellationToken);
}