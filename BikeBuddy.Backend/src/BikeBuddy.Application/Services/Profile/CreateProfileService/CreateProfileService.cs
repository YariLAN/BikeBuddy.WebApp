using BikeBuddy.Application.DtoModels.Profile;
using BikeBuddy.Application.Mappers.Profile;
using BikeBuddy.Domain.Models;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Application.Services.Profile.CreateProfileService;

public class CreateProfileService(IUserProfileRepository userProfileRepository) : ICreateProfileService
{
    public async Task<Result<bool, Error>> ExecuteAsync(Guid userId, UserProfileRequest request, CancellationToken cancellationToken)
    {
        // Proccess - Validation
        var addressResult = Address.Create(request.Address);

        if (addressResult.IsFailure)
            return addressResult.Error;

        var dbProfile = UserProfileMapper.ToMap(userId, request, addressResult.Value);

        var id = await userProfileRepository.CreateAsync(dbProfile, cancellationToken);

        if (id is null)
            return Error.Failure("Не удалось создать новые данные");

        return true;
    }
}
