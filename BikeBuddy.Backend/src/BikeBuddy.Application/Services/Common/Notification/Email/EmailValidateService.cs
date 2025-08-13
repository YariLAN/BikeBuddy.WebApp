using BikeBuddy.Application.DtoModels.Notification.Email;
using BikeBuddy.Application.Services.Auth;

namespace BikeBuddy.Application.Services.Common;

internal sealed class EmailValidateService(IAuthRepository authRepository, IPasswordHasher hasher)
    : IEmailValidateService
{
    public Task<EmailValidateQuery> GetByTokenAsync(string token, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public ConfirmationTokenQuery GenerateConfirmationToken(GenerateTokenCommand command)
    {
        var token = hasher.Generate(Guid.Parse(command.UserId + command.Email).ToString());

        return new ConfirmationTokenQuery(token, DateTime.UtcNow.AddHours(command.ValidHours));
    }
}