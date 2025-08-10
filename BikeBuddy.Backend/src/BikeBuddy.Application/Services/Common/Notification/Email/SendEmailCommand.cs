namespace BikeBuddy.Application.Services.Common;

public record SendEmailCommand(string Email, string Title, string Message, string? Link = "");