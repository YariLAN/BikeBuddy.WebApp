namespace BikeBuddy.Application.DtoModels.User.Auth;

public record RegisterRequest(string Email, string Password, string UserName);

