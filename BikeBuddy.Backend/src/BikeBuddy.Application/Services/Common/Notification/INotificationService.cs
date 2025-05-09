using NotificationModel = BikeBuddy.Domain.Models.NotificationControl.Notification;

namespace BikeBuddy.Application.Services.Common.Notification;

public interface INotificationService
{
    Task SenAsync(Guid recipientId, NotificationModel notification, CancellationToken cancellationToken);
}
