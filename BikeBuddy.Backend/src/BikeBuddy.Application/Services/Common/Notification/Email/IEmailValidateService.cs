using BikeBuddy.Application.DtoModels.Notification.Email;

namespace BikeBuddy.Application.Services.Common;

public interface IEmailValidateService
{
    Task<EmailValidateQuery> GetByTokenAsync(string token, CancellationToken cancellationToken = default);

    ConfirmationTokenQuery GenerateConfirmationToken(GenerateTokenCommand command);
}