using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

using NotificationModel = BikeBuddy.Domain.Models.NotificationControl.Notification;

namespace BikeBuddy.Application.Services.Common.Notification;

public interface INotificationRepository
{
    Task<Result<Guid, Error>> CreateAsync(NotificationModel notification, CancellationToken cancellationToken);

    Task<Result<(List<NotificationModel>, int), Error>> GetAllByUserAsync(Guid userId, CancellationToken cancellationToken);

    Task<Result<NotificationModel, Error>> GetAsync(Guid notificationId, CancellationToken cancellationToken);

    Task<Result<bool, Error>> MarkAllAsReadAsync(Guid userId, CancellationToken cancellationToken);

    Task<Result<bool, Error>> UpdateAsync(NotificationModel notification, CancellationToken cancellationToken);
}
