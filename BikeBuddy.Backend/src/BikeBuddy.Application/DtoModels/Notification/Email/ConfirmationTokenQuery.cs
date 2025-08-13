namespace BikeBuddy.Application.DtoModels.Notification.Email;

public record ConfirmationTokenQuery(string Token, DateTime ExpiresAt);