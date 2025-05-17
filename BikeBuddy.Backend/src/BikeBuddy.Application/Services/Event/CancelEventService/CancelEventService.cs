using BikeBuddy.Domain.Models.EventControl.ValueObjects;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;
using System.Security.Claims;

namespace BikeBuddy.Application.Services.Event.CancelEventService;

public class CancelEventService(IEventRepository eventRepository) : ICancelEventService
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

        // тут надо будет удалить все фоновые задачи, связанные с данным заездом

        return await eventRepository.UpdateAsync(dbEventResult.Value, cancellationToken); 
    }
}
