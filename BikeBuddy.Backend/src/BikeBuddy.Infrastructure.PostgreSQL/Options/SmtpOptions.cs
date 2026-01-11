namespace BikeBuddy.Infrastructure.Options;

internal sealed class SmtpOptions
{
    public string Server { get; set; } = string.Empty;

    public string Port { get; set; } = string.Empty;

    public string Account { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;

    public string SenderEmail { get; set; } = string.Empty;

    public string SenderName { get; set; } = string.Empty;
}