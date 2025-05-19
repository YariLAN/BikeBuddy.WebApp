using BikeBuddy.Application.Services.Scheduler.Event;
using BikeBuddy.Domain.Models.EventControl.ValueObjects;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;
using System.Security.Claims;

namespace BikeBuddy.Application.Services.Event.CancelEventService;

public class CancelEventService(IEventRepository eventRepository, IEventJobSchedulerService _eventJobSchedulerService) : ICancelEventService
{
    public async Task<Result<bool, Error>> ExecuteAsync(Guid eventId, ClaimsPrincipal user, CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var dbEventResult = await eventRepository.GetEventAsync(eventId, cancellationToken);
        if (dbEventResult.IsFailure)
            return dbEventResult.Error;

        if (userId != dbEventResult.Value.CreatedBy)
            return Errors.General.AccessIsDenied(userId);

        if (dbEventResult.Value.Status == EventStatus.CANCELLED)
            return Errors.Event.AlreadyStatus(EventStatus.CANCELLED);

        dbEventResult.Value.UpdateStatus(EventStatus.CANCELLED);

        var resultCancel = await eventRepository.UpdateAsync(dbEventResult.Value, cancellationToken); 

        if (resultCancel.IsFailure) 
            return resultCancel.Error;

        _eventJobSchedulerService.DeleteJobsForEvent(eventId, cancellationToken);

        return resultCancel.IsSuccess;
    }
}
