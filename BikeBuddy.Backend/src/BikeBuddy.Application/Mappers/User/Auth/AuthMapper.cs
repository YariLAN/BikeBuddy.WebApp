using BikeBuddy.Application.DtoModels.User.Auth;
using BikeBuddy.Domain.Models.AuthControl;

namespace BikeBuddy.Application.Mappers.User.Auth;

public class AuthMapper
{
    public static AuthUser ToMap(RegisterRequest registerRequest, string passwordhash)
    {
        return AuthUser.Create(
            Guid.NewGuid(),
            registerRequest.Email,
            registerRequest.UserName,
            passwordhash,
            false,
            DateTime.UtcNow);
    }
}
