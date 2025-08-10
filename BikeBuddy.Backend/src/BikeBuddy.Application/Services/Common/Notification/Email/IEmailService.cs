namespace BikeBuddy.Application.Services.Common;

using MailKit = NETCore.MailKit.Core;

public interface IEmailService : MailKit.IEmailService
{
    public Task<bool> SendToUserAsync(SendEmailCommand command, CancellationToken cancellationToken = default);
}