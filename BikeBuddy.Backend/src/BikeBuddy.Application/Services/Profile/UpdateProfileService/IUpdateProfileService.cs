using BikeBuddy.Application.DtoModels.Profile;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Application.Services.Profile.UpdateProfileService;

public interface IUpdateProfileService
{
    Task<Result<bool, Error>> ExecuteAsync(Guid userId, UserProfileRequest request, CancellationToken cancellationToken);
}
