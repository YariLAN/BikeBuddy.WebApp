using BikeBuddy.Application.DtoModels.Notification;

namespace BikeBuddy.Application.Services.Common;

public interface IRealTimeNotifier
{
    Task SendToUserAsync(Guid recipientId, NotificationResponse notification, CancellationToken ct);
}
