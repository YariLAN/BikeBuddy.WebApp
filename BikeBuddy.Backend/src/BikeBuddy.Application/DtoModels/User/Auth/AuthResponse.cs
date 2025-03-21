namespace BikeBuddy.Application.DtoModels.User.Auth;

public record AuthResponse(string AccessToken, DateTime ExpiresAt);
