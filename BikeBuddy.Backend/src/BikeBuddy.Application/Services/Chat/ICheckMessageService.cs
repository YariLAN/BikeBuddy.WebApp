namespace BikeBuddy.Application.Services.Chat;

public interface ICheckMessageService
{
    Task<CheckMessageResponse> CheckAsync(CancellationToken ct = default);
}

public record CheckMessageResponse(string Text);