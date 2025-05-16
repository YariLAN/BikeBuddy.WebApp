using BikeBuddy.API.Hubs;
using BikeBuddy.Application.DtoModels.Notification;
using BikeBuddy.Application.Services.Common;
using Microsoft.AspNetCore.SignalR;

namespace BikeBuddy.API.Services;

// в NotificationResponse нет автора (излишний)

public class RealTimeNotifier(IHubContext<NotificationHub> _hubContext) : IRealTimeNotifier
{
    public async Task SendToUserAsync(Guid recipientId, NotificationResponse notification, CancellationToken ct)
    {
        await _hubContext.Clients
            .Group(recipientId.ToString())
            .SendAsync("ReceiveNotification", notification, ct);
    }
}
