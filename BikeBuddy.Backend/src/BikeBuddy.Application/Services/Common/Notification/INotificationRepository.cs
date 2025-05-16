using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

using NotificationModel = BikeBuddy.Domain.Models.NotificationControl.Notification;

namespace BikeBuddy.Application.Services.Common.Notification;

public interface INotificationRepository
{
    Task<Result<Guid, Error>> CreateAsync(NotificationModel notification, CancellationToken cancellationToken);
}
