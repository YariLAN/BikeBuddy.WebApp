namespace BikeBuddy.Application.Services.Auth.Verify;

public record ConfirmationTokenQuery(string Token, DateTimeOffset ExpiresAt);