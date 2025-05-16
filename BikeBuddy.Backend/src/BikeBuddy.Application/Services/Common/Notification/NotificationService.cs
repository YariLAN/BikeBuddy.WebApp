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
    public async Task<Result<Task, Error>> SenAsync(Guid recipientId, NotificationDto notification, CancellationToken cancellationToken)
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
}
