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
        var tempEndDate = eventDb.Value.EndDate;

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

        if (tempStartDate != updateRequest.StartDate || tempEndDate != updateRequest.EndDate)
        {
            _eventJobSchedulerService.DeleteJobsForEvent(eventDb.Value.Id, cancellationToken);
            _eventJobSchedulerService.Schedule(eventDb.Value.Id, userId, updateRequest.StartDate, eventDb.Value.EndDate, cancellationToken);

            if ((updateRequest.StartDate - DateTime.Now).TotalHours > 3 && eventDb.Value.IsConfirmedByAuthor.HasValue)
            {
                eventDb.Value.UpdateConfirmed(null);
            }
        }

        var updResult = await eventRepository.UpdateAsync(eventDb.Value, cancellationToken);

        if (updResult.IsFailure) return updResult.Error;

        return updResult;
    }
}
