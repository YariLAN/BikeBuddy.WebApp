using BikeBuddy.Application.Services.Common.Notification;
using BikeBuddy.Application.Services.Event;
using BikeBuddy.Domain.Models.NotificationControl;
using BikeBuddy.Domain.Models.NotificationControl.ValueObject;
using BikeBuddy.Domain.Models.EventControl.ValueObjects;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Application.Jobs.Executor.Event;

public class EventJobExecutor(IEventRepository eventRepository, INotificationService notificationService) : IEventJobExecutor
{
    public async Task<Result<bool, Error>> NotifyAboutStartConfirmation(Guid eventId, Guid authorId, CancellationToken cancellationToken)
    {
        var eventDb = await eventRepository.GetEventAsync(eventId, cancellationToken);

        if (eventDb.IsFailure) return eventDb.Error;

        // создавать в БД Notification и маппер
        var notification = Notification.Create(
            Guid.NewGuid(), 
            authorId,
            $"Подтвердите свой заезд '{eventDb.Value.Name}'", 
            MessageType.Info, 
            false);

        await notificationService.SenAsync(authorId, notification, cancellationToken);

        return true;
    }

    public async Task<Result<bool, Error>> AutoConfirmStart(Guid eventId, CancellationToken cancellationToken)
    {
        var eventDb = await eventRepository.GetEventAsync(eventId, cancellationToken);

        if (eventDb.IsFailure) return eventDb.Error;

        eventDb.Value.UpdateStatus(EventStatus.CLOSED);

        return await eventRepository.UpdateAsync(eventDb.Value, cancellationToken); 
    }

    public Task<Result<bool, Error>> AutoComplete(Guid eventId, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public Task<Result<bool, Error>> NotifyAboutFinishConfirmation(Guid eventId, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public Task<Result<bool, Error>> RepeatFinishNotification(Guid eventId, Guid authorId, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}
