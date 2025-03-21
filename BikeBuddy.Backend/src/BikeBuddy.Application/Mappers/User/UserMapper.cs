using BikeBuddy.Application.DtoModels.User;
using BikeBuddy.Domain.Models.AuthControl;

namespace BikeBuddy.Application.Mappers.User;

public class UserMapper
{
    public static UserResponse ToMap(AuthUser user)
    {
        var profile = user.UserProfile;

        return new UserResponse(
            user.UserName,
            user.Email,
            profile.Surname,
            profile.Name,
            profile.MiddleName,
            profile.BirthDay,
            profile.Address.ToString());
    }
}
