namespace BikeBuddy.Application.DtoModels.User;

public record UserResponse(
    Guid UserID,
    string UserName,
    string Email,
    string Surname,
    string Name,
    string MiddleName,
    DateTime? BirthDay,
    string Address,
    string PhotoUrl = "");
