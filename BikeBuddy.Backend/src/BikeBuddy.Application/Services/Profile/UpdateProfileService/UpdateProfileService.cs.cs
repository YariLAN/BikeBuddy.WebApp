using BikeBuddy.Application.DtoModels.Profile;
using BikeBuddy.Application.Mappers.User.Profile;
using BikeBuddy.Domain.Models.ProfileControl.ValueObjects;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Application.Services.Profile.UpdateProfileService;

public class UpdateProfileService(IUserProfileRepository userProfileRepository) : IUpdateProfileService
{
    public async Task<Result<bool, Error>> ExecuteAsync(Guid userId, UserProfileRequest request, CancellationToken cancellationToken)
    {
        var addressResult = Address.Create(request.Address);

        var dbProfile = UserProfileMapper.ToMap(userId, request, addressResult.Value);

        var result = await userProfileRepository.UpdateAsync(dbProfile, cancellationToken);

        if (result.IsFailure)
            return result.Error;

        if (!result.Value)
            return Error.Failure("Не удалось обновить данные");

        return true;
    }
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        