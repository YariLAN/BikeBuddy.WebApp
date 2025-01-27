using BikeBuddy.Application.DtoModels.Profile;
using BikeBuddy.Domain.Models;

namespace BikeBuddy.Application.Mappers.Profile;

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

    public static UserProfile ToMap(UserProfileRequest request, Address address)
    {
        return UserProfile.Create(
            Guid.NewGuid(), 
            request.UserId, 
            request.Surname, 
            request.Name, 
            request.MiddleName, 
            request.BirthDay, 
            address
        );
    }
}
