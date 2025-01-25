using BikeBuddy.Application.DtoModels.Profile;
using BikeBuddy.Domain.Models;

namespace BikeBuddy.Application.Mappers.Profile;

public class UserProfileResponseMapper
{
    public static UserProfileResponse ToMap(UserProfile profile)
    {
        return new(
            profile.Id, 
            profile.Surname, 
            profile.Name,
            profile.MiddleName,
            profile.BirthDay,
            profile.Address);
    }
}
