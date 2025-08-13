namespace BikeBuddy.Application.Services.Common;

public record GenerateTokenCommand(Guid UserId, string Email, int ValidHours = 12);