using BikeBuddy.Application.Services.Common.Notification;
using BikeBuddy.Application.Services.Event;
using BikeBuddy.Domain.Models.EventControl.ValueObjects;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;
using BikeBuddy.Application.DtoModels.Notification;
using System.Globalization;
using BikeBuddy.Domain.Models.NotificationControl.ValueObject;

namespace BikeBuddy.Application.Jobs.Executor.Event;

public class EventJobExecutor(IEventRepository eventRepository, INotificationService notificationService) : IEventJobExecutor
{
    public async Task<Result<bool, Error>> NotifyAboutStartConfirmation(Guid eventId, Guid authorId, CancellationToken cancellationToken)
    {
        var eventDb = await eventRepository.GetEventAsync(eventId, cancellationToken);

        if (eventDb.IsFailure) return eventDb.Error;

        var msg = $"До начала заезда \"{eventDb.Value.Name}\" осталось 3 часа " +
            $"({eventDb.Value.StartDate.ToString("dd MMMM yyyy 'в' HH:mm", CultureInfo.GetCultureInfo("ru-RU"))}), подтвердите его в карточке или отмените полностью.";

        await notificationService.SendAsync(authorId, 
            new NotificationDto(authorId, "Подтвердите заезд", msg, $"events/{eventDb.Value.Id}", MessageType.Warning), cancellationToken);

        eventDb.Value.UpdateConfirmed(false);

        return await eventRepository.UpdateAsync(eventDb.Value, cancellationToken);
    }

    public async Task<Result<bool, Error>> AutoConfirmStart(Guid eventId, CancellationToken cancellationToken)
    {
        var eventDb = await eventRepository.GetEventAsync(eventId, cancellationToken);

        if (eventDb.IsFailure) return eventDb.Error;

        var authorId = eventDb.Value.CreatedBy!.Value;

        await notificationService.SendAsync(authorId,
            new NotificationDto(authorId, "Заезд стартовал", $"Система запустила событие \"{eventDb.Value.Name}\"",  $"events/{eventDb.Value.Id}", MessageType.Success),
            cancellationToken);

        if (eventDb.Value.IsConfirmedByAuthor.HasValue && !eventDb.Value.IsConfirmedByAuthor.Value)
        {
            eventDb.Value.UpdateConfirmed(true);
        }

        eventDb.Value.UpdateStatus(EventStatus.STARTED);

        return await eventRepository.UpdateAsync(eventDb.Value, cancellationToken);
    }

    public async Task<Result<bool, Error>> AutoComplete(Guid eventId, CancellationToken cancellationToken)
    {
        var eventDb = await eventRepository.GetEventAsync(eventId, cancellationToken);

        if (eventDb.IsFailure) return eventDb.Error;

        if (eventDb.Value.Status != EventStatus.COMPLETED)
        {
            eventDb.Value.UpdateStatus(EventStatus.COMPLETED);
        }

        return await eventRepository.UpdateAsync(eventDb.Value, cancellationToken);
    }

    public async Task<Result<bool, Error>> NotifyAboutFinishConfirmation(Guid eventId, CancellationToken cancellationToken)
    {
        var eventDb = await eventRepository.GetEventAsync(eventId, cancellationToken);

        if (eventDb.IsFailure) return eventDb.Error;

        var authorId = eventDb.Value.CreatedBy!.Value;

        await notificationService.SendAsync(authorId,
            new NotificationDto(authorId,
                "Подтвердите завершение заезда",
                $"Прошел час после планового завершения события \"{eventDb.Value.Name}\", подтвердите в карточке. Если заезд не завершен, подтвердить вы сможете позже.",
                $"events/{eventDb.Value.Id}"),
            cancellationToken);

        return true;
    }

    public async Task<Result<bool, Error>> RepeatFinishNotification(Guid eventId, Guid authorId, CancellationToken cancellationToken)
    {
        var eventDb = await eventRepository.GetEventAsync(eventId, cancellationToken);

        if (eventDb.IsFailure) return eventDb.Error;

        await notificationService.SendAsync(authorId,
            new NotificationDto(authorId,
                "Повторное напоминание о завершение заезда",
                $"Заезд \"{eventDb.Value.Name}\" все еще ждет завершения, подтвердите его в карточке, как будет такая ситуация.",
                $"events/{eventDb.Value.Id}"),
            cancellationToken);

        return true;
    }
}
