namespace BikeBuddy.Application.DtoModels.Auth;

public record AuthResponse(string AccessToken, DateTime ExpiresAt);
