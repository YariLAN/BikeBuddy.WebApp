using BikeBuddy.Application.DtoModels.Common;
using BikeBuddy.Application.DtoModels.Notification;
using BikeBuddy.Application.Mappers.Notification;
using BikeBuddy.Application.Services.Auth;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Application.Services.Common.Notification;

public class NotificationService(
    INotificationRepository notificationRepository,
    IAuthRepository authRepository,
    IRealTimeNotifier realTimeNotifier) : INotificationService
{
    public async Task<Result<Task, Error>> SendAsync(Guid recipientId, NotificationDto notification, CancellationToken cancellationToken)
    {
        var user = await authRepository.GetAsync(recipientId, cancellationToken);

        if (user is null) 
            return Errors.General.NotFound(recipientId);

        var notificationDb = NotificationMapper.ToMap(notification);

        var resultAdded = await notificationRepository.CreateAsync(notificationDb, cancellationToken);

        if (resultAdded.IsFailure) 
            return resultAdded.Error;

        return realTimeNotifier.SendToUserAsync(recipientId, NotificationMapper.ToMap(notificationDb), cancellationToken);
    }

    public async Task<Result<PageData<NotificationResponse>, Error>> GetByUserAsync(Guid recipientId, CancellationToken cancellationToken)
    {
        var user = await authRepository.GetAsync(recipientId, cancellationToken);

        if (user is null)
            return Errors.General.NotFound(recipientId);

        var result = await notificationRepository.GetAllByUserAsync(recipientId, cancellationToken);

        if (result.IsFailure)
            return result.Error;

        var (notification, total) = result.Value;

        return new PageData<NotificationResponse>
        {
            Body = notification.ConvertAll(n => NotificationMapper.ToMap(n)),
            TotalCount = total,
        };
    }

    public async Task<Result<bool, Error>> MarkAsReadAsync(Guid notificationId, Guid recipientId, CancellationToken cancellationToken)
    {
        var user = await authRepository.GetAsync(recipientId, cancellationToken);

        if (user is null)
            return Errors.General.NotFound(recipientId);

        var notification = await notificationRepository.GetAsync(notificationId, cancellationToken);

        if (notification.IsFailure) return notification.Error;

        if (notification.Value.IsRead)
            return true;

        notification.Value.UpdateRead();

        return await notificationRepository.UpdateAsync(notification.Value, cancellationToken);
    }

    public async Task<Result<bool, Error>> MarkAllAsReadAsync(Guid recipientId, CancellationToken cancellationToken)
    {
        var user = await authRepository.GetAsync(recipientId, cancellationToken);

        if (user is null)
            return Errors.General.NotFound(recipientId);

        return await notificationRepository.MarkAllAsReadAsync(recipientId, cancellationToken);
    }
}
