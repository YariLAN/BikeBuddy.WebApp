using BikeBuddy.Application.Services.Common.Notification;
using BikeBuddy.Application.Services.Event;
using BikeBuddy.Domain.Models.NotificationControl;
using BikeBuddy.Domain.Models.NotificationControl.ValueObject;
using BikeBuddy.Domain.Models.EventControl.ValueObjects;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;
using BikeBuddy.Application.DtoModels.Notification;

namespace BikeBuddy.Application.Jobs.Executor.Event;

public class EventJobExecutor(IEventRepository eventRepository, INotificationService notificationService) : IEventJobExecutor
{
    public async Task<Result<bool, Error>> NotifyAboutStartConfirmation(Guid eventId, Guid authorId, CancellationToken cancellationToken)
    {
        var eventDb = await eventRepository.GetEventAsync(eventId, cancellationToken);

        if (eventDb.IsFailure) return eventDb.Error;

        await notificationService.SenAsync(authorId, 
            new NotificationDto(authorId,
                "Подтвердите заезд",
                $"Заезд \"{eventDb.Value.Name}\" скоро начнется, подтвердите его",
                $"events/{eventDb.Value.Id}"), 
            cancellationToken);

        return true;
    }

    public async Task<Result<bool, Error>> AutoConfirmStart(Guid eventId, CancellationToken cancellationToken)
    {
        var eventDb = await eventRepository.GetEventAsync(eventId, cancellationToken);

        if (eventDb.IsFailure) return eventDb.Error;

        if (eventDb.Value.Status == EventStatus.OPENED)
        {
            var authorId = eventDb.Value.CreatedBy!.Value;

            await notificationService.SenAsync(authorId,
                new NotificationDto(authorId,
                    "Велозаезд был начат",
                    $"Система запустила событие \"{eventDb.Value.Name}\"",
                    $"events/{eventDb.Value.Id}"),
                cancellationToken);

            eventDb.Value.UpdateStatus(EventStatus.CLOSED);

            return await eventRepository.UpdateAsync(eventDb.Value, cancellationToken); 
        }

        return true;
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
