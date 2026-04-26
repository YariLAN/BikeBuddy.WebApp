using BikeBuddy.Application.DtoModels.Profile;
using BikeBuddy.Domain.Models.ProfileControl;
using BikeBuddy.Domain.Models.ProfileControl.ValueObjects;
using System.Linq;

namespace BikeBuddy.Application.Mappers.User.Profile;

public class UserProfileMapper
{
    public static IReadOnlyList<UserProfileResponse> ToMap(IReadOnlyCollection<UserProfile> profiles)
    {
        return profiles
            .Select(ToMap)
            .ToList();
    }
    
    public static UserProfileResponse ToMap(UserProfile profile)
    {
        return new(
            profile.Id,
            profile.Surname,
            profile.Name,
            profile.MiddleName,
            profile.BirthDay,
            profile.Address.ToString(),
            profile.PhotoUrl);
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
