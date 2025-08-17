using BikeBuddy.Application.Services.Common;
using NETCore.MailKit;

namespace BikeBuddy.Infrastructure.Services.Common;

sealed class EmailService : NETCore.MailKit.Core.EmailService, IEmailService
{
    public EmailService(IMailKitProvider provider) : base(provider) { }
    
    public async Task<bool> SendToUserAsync(SendEmailCommand command, CancellationToken cancellationToken = default)
    {
        var linkToHtml = !string.IsNullOrEmpty(command.Link) 
            ? $"<p><a href=\"https://localhost:5216/{command.Link}\">Ссылка на сайт</a></p>" 
            : "";
        
        try
        {
            await SendAsync(command.Email, command.Title,  
                $"<p>{command.Message}</p>" + linkToHtml, 
                isHtml: true);
        }
        catch (Exception ex)
        {
            return false;
        }

        return true;
    }
}