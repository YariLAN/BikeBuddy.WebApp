namespace BikeBuddy.Application.DtoModels.Notification.Email;

public record EmailValidateQuery(string Email, bool IsValidate, string Token, DateTime ExpiresAt);