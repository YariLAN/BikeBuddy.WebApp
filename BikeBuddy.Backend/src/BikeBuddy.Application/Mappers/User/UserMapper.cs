using BikeBuddy.Application.DtoModels.User;
using BikeBuddy.Domain.Models.AuthControl;
using BikeBuddy.Domain.Models.ProfileControl;

namespace BikeBuddy.Application.Mappers.User;

public class UserMapper
{
    public static UserResponse ToMap(AuthUser user)
    {
        var profile = user.UserProfile;

        return new UserResponse(
            user.Id,
            user.UserName,
            user.Email,
            profile.Surname,
            profile.Name,
            profile.MiddleName,
            profile.BirthDay,
            profile.Address.ToString() ?? "");
    }     
    
    public static UserResponse ToMap(UserProfile profile)
    {
        var authUser = profile.AuthUser;

        return new UserResponse(
            authUser.Id,
            authUser.UserName,
            authUser.Email,
            profile.Surname,
            profile.Name,
            profile.MiddleName,
            profile.BirthDay,
            profile.Address.ToString(),
            PhotoUrl: profile.PhotoUrl ?? "");
    }
}
