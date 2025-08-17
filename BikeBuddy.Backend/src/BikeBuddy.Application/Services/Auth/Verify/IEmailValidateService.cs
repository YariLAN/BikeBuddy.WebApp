using BikeBuddy.Application.Services.Common;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Application.Services.Auth.Verify;

public interface IEmailVerificationService
{
    Task<Result<bool, Error>> ExecuteAsync(EmailVerificationCommand command,
        CancellationToken cancellationToken = default);

    ConfirmationTokenQuery GenerateConfirmationToken(GenerateTokenCommand command);
}