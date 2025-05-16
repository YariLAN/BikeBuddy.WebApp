using BikeBuddy.Application.DtoModels.Notification;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Application.Services.Common.Notification;

public interface INotificationService
{
    Task<Result<Task, Error>> SenAsync(Guid recipientId, NotificationDto notification, CancellationToken cancellationToken);
}
