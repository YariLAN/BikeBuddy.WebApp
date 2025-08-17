
using BikeBuddy.Application.Services.Common;
using BikeBuddy.Domain.Models.AuthControl;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Application.Services.Auth.Verify;

internal sealed class EmailVerificationService(IAuthRepository authRepository, IPasswordHasher hasher)
    : IEmailVerificationService
{
    public async Task<Result<bool, Error>> ExecuteAsync(
        EmailVerificationCommand command,
        CancellationToken cancellationToken)
    {
        var user = await authRepository.GetAsync(command.UserId, cancellationToken);

        if (user is null)
            return Errors.General.NotFound(command.UserId);

        if (user.IsVerified)
            return Errors.Auth.IsVerified(command.UserId);

        if (InvalidToken(user, command.Token, command.Expire))
            return Error.Validation("Verification Token is invalid");

        user.AddOrUpdateConfirmationData(true);
        var updated = await authRepository.UpdateAsync(user, cancellationToken);

        if (updated.IsFailure)
            return updated.Error;

        return updated.IsSuccess;
    }

    private bool InvalidToken(AuthUser user, string token, DateTimeOffset expire)
        => (!string.IsNullOrEmpty(user.ConfirmationToken) && user.ConfirmationExpiresAt.HasValue) && 
           (user.ConfirmationToken != token || user.ConfirmationExpiresAt.Value < expire);
    
    public ConfirmationTokenQuery GenerateConfirmationToken(GenerateTokenCommand command)
    {
        var code = (command.UserId + command.Email);
        
        var token = hasher.Generate(code + code.GetHashCode());

        return new ConfirmationTokenQuery(token, DateTimeOffset.UtcNow.AddHours(command.ValidHours));
    }
}