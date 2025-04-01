using BikeBuddy.Application.DtoModels.Profile;
using BikeBuddy.Domain.Models.ProfileControl;
using BikeBuddy.Domain.Models.ProfileControl.ValueObjects;

namespace BikeBuddy.Application.Mappers.User.Profile;

public class UserProfileMapper
{
    public static UserProfileResponse ToMap(UserProfile profile)
    {
        return new(
            profile.Id,
            profile.Surname,
            profile.Name,
            profile.MiddleName,
            profile.BirthDay,
            profile.Address.ToString());
    }

    public static UserProfile ToMap(Guid userId, UserProfileRequest request, Address address)
    {
        return UserProfile.Create(
            Guid.NewGuid(),
            userId,
            request.Surname,
            request.Name,
            request.MiddleName,
            request.BirthDay,
            address
        );
    }
}
