using BikeBuddy.Application.DtoModels.Profile;
using BikeBuddy.Application.Mappers.Profile;
using BikeBuddy.Domain.Models;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Application.Services.Profile.UpdateProfileService;

public class UpdateProfileService(IUserProfileRepository userProfileRepository) : IUpdateProfileService
{
    public async Task<Result<bool, Error>> ExecuteAsync(UserProfileRequest request, CancellationToken cancellationToken)
    {
        var addressResult = Address.Create(request.Address);

        if (addressResult.IsFailure)
            return addressResult.Error;

        var dbProfile = UserProfileMapper.ToMap(request, addressResult.Value);

        var result = await userProfileRepository.UpdateAsync(dbProfile, cancellationToken);

        if (result.IsFailure)
            return result.Error;

        if (!result.Value)
            return Error.Failure("Не удалось обновить данные");

        return true;
    }
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        