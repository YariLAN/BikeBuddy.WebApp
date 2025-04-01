using BikeBuddy.Application.DtoModels.Profile;
using BikeBuddy.Application.Mappers.User.Profile;
using BikeBuddy.Application.Services.Auth;
using BikeBuddy.Domain.Models.ProfileControl.ValueObjects;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Application.Services.Profile.CreateProfileService;

public class CreateProfileService(IUserProfileRepository userProfileRepository, IAuthRepository authRepository) : ICreateProfileService
{
    public async Task<Result<bool, Error>> ExecuteAsync(Guid userId, UserProfileRequest request, CancellationToken cancellationToken)
    {
        var addressResult = Address.Create(request.Address);

        var user = authRepository.GetAsync(userId, cancellationToken);

        if (user is null)
            return Error.NotFound("Пользователь не найден");

        var dbProfile = UserProfileMapper.ToMap(userId, request, addressResult.Value);

        var id = await userProfileRepository.CreateAsync(dbProfile, cancellationToken);

        if (id is null)
            return Error.Failure("Не удалось создать новые данные");

        return true;
    }
}
