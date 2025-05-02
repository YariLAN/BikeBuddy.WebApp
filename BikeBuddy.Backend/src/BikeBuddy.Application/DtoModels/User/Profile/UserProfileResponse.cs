namespace BikeBuddy.Application.DtoModels.Profile;

public record UserProfileResponse(
    Guid Id, 
    string Surname,
    string Name, 
    string MiddleName, 
    DateTime? BirthDay, 
    string Address,
    string AvatarUrl);
