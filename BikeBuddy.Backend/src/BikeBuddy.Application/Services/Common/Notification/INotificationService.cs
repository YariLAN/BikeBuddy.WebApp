using BikeBuddy.Application.DtoModels.Common;
using BikeBuddy.Application.DtoModels.Notification;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Application.Services.Common.Notification;

public interface INotificationService
{
    Task<Result<Task, Error>> SenAsync(Guid recipientId, NotificationDto notification, CancellationToken cancellationToken);

    Task<Result<PageData<NotificationResponse>, Error>> GetByUserAsync(Guid recipientId, CancellationToken cancellationToken);

    Task<Result<bool, Error>> MarkAsReadAsync(Guid notificationId, Guid recipientId, CancellationToken cancellationToken); 
    
    Task<Result<bool, Error>> MarkAllAsReadAsync(Guid recipientId, CancellationToken cancellationToken);
}
