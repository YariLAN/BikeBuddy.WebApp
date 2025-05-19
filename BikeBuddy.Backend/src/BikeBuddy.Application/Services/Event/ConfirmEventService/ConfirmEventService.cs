using BikeBuddy.Application.Services.Scheduler.Event;
using BikeBuddy.Domain.Models.EventControl.ValueObjects;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Application.Services.Event.ConfirmEventService;

public class ConfirmEventService(IEventRepository eventRepository, IEventJobSchedulerService eventJobSchedulerService) : IConfirmEventService
{
    public async Task<Result<bool, Error>> ExecuteConfirmStartAsync(Guid eventId, CancellationToken cancellationToken)
    {
        var dbEventResult = await eventRepository.GetEventAsync(eventId, cancellationToken);

        if (dbEventResult.IsFailure)
            return dbEventResult.Error;          

        dbEventResult.Value.UpdateConfirmed(true);

        return await eventRepository.UpdateAsync(dbEventResult.Value, cancellationToken);
    }

    public async Task<Result<bool, Error>> ExecuteConfirmFinishAsync(Guid eventId, CancellationToken cancellationToken)
    {        
        var dbEventResult = await eventRepository.GetEventAsync(eventId, cancellationToken);

        if (dbEventResult.IsFailure)
            return dbEventResult.Error;

        eventJobSchedulerService.DeleteJobsForEvent(eventId, cancellationToken);

        dbEventResult.Value.UpdateStatus(EventStatus.COMPLETED);

        return await eventRepository.UpdateAsync(dbEventResult.Value, cancellationToken);
    }
}
