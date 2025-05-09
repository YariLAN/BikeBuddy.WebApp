using BikeBuddy.API.Hubs;
using BikeBuddy.Application.Services.Common.Notification;
using Microsoft.AspNetCore.SignalR;

namespace BikeBuddy.API.Services;

public class NotificationService(IHubContext<NotificationHub> _hubContext) : INotificationService
{
    public Task SenAsync(Guid recipientId, Domain.Models.NotificationControl.Notification notification, CancellationToken cancellationToken)
    {
        return _hubContext.Clients
            .Group(recipientId.ToString())
            .SendAsync("ReceiveNotification", notification, cancellationToken);
    }
}
