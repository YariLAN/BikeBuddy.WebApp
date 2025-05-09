using BikeBuddy.Application.DtoModels.Event;
using BikeBuddy.Application.Services.Scheduler.Event;
using BikeBuddy.Domain.Models.EventControl.ValueObjects;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;
using System.Security.Claims;

namespace BikeBuddy.Application.Services.Event.UpdateEventService;

public class UpdateEventService(IEventRepository eventRepository, IEventJobSchedulerService _eventJobSchedulerService) : IUpdateEventService
{
    public async Task<Result<bool, Error>> ExecuteAsync(Guid eventId, UpdateEventRequest updateRequest, ClaimsPrincipal user, CancellationToken cancellationToken)
    {
        var points = updateRequest.Points
            .Select(p => PointDetails.Create(p.OrderId, p.Point.Lat, p.Point.Lon, p.Address))
            .Select(x => x.Value);

        var eventDb = await eventRepository.GetEventAsync(eventId, cancellationToken);
        if (eventDb.IsFailure) return eventDb.Error;

        var userId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);

        if (eventDb.Value.CreatedBy != userId)
            return Errors.General.AccessIsDenied(userId);

        if (updateRequest.CountMembers < eventDb.Value.Chat.Members.Count)
            return Error.Validation("Число участников меньше зарегистрированного числа");

        if (updateRequest.CountMembers > eventDb.Value.CountMembers && eventDb.Value.Status == EventStatus.CLOSED)
            eventDb.Value.UpdateStatus(EventStatus.OPENED);
        else if (updateRequest.CountMembers == eventDb.Value.Chat.Members.Count)
            eventDb.Value.UpdateStatus(EventStatus.CLOSED);

        var tempStartDate = eventDb.Value.StartDate;

        eventDb.Value.Update(
            updateRequest.Name,
            updateRequest.Description,
            updateRequest.Type,
            updateRequest.BicycleType,
            updateRequest.CountMembers,
            (int)(updateRequest.Distance * 1000),
            updateRequest.StartAddress,
            updateRequest.EndAddress,
            updateRequest.StartDate,
            updateRequest.EndDate,
            EventDetails.Create(points));

        var updResult = await eventRepository.UpdateAsync(eventDb.Value, cancellationToken);

        if (updResult.IsFailure) return updResult.Error;

        if (tempStartDate != updateRequest.StartDate)
            _eventJobSchedulerService.Schedule(eventDb.Value.Id, userId, updateRequest.StartDate, eventDb.Value.EndDate);

        return updResult;
    }
}
