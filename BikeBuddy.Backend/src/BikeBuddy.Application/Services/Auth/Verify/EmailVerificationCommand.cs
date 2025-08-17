namespace BikeBuddy.Application.Services.Auth.Verify;

public record EmailVerificationCommand(Guid UserId, string Token, DateTimeOffset Expire);