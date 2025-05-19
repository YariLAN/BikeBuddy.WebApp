using BikeBuddy.Application.DtoModels.Event;
using BikeBuddy.Application.Mappers.User;
using BikeBuddy.Domain.Models.EventControl.ValueObjects;

namespace BikeBuddy.Application.Mappers.Event;

public class EventMapper
{
    public static Domain.Models.EventControl.Event ToMap(CreateEventRequest request, IEnumerable<PointDetails> points)
    {
        return Domain.Models.EventControl.Event.Create(
            id: Guid.NewGuid(),
            name: request.Name,
            description: request.Description,
            type: request.Type,
            bicycleType: request.BicycleType,
            countMembers: request.CountMembers,
            distance: (int)(request.Distance * 1000),
            startAddress: request.StartAddress,
            endAddress: request.EndAddress,
            startDate: request.StartDate,
            endDate: request.EndDate,
            details: EventDetails.Create(points),
            status: request.Status,
            createdBy: request.UserId);
    }

    public static EventListResponse ToMap(Domain.Models.EventControl.Event dbEvent, string imageUrl)
    {
        return new EventListResponse(
            dbEvent.Id,
            dbEvent.Name,
            dbEvent.Description,
            dbEvent.Type,
            dbEvent.BicycleType,
            dbEvent.CountMembers,
            ((double)dbEvent.Distance / 1000),
            dbEvent.StartAddress,
            dbEvent.EndAddress,
            dbEvent.StartDate,
            dbEvent.EndDate,
            dbEvent.User.UserName,
            dbEvent.Status,
            dbEvent.IsConfirmedByAuthor,
            imageUrl);
    }

    public static EventResponse ToMap(Domain.Models.EventControl.Event dbEvent)
    {
        var userResponse = UserMapper.ToMap(dbEvent.User);

        var isPlannedFinished = DateTime.Now > dbEvent.EndDate.AddHours(1); 

        return new EventResponse(
            dbEvent.Id,
            dbEvent.Name,
            dbEvent.Description,
            dbEvent.Type,
            dbEvent.BicycleType,
            dbEvent.CountMembers,
            dbEvent.Chat.Members.Count,
            dbEvent.Distance,
            dbEvent.StartAddress,
            dbEvent.EndAddress,
            dbEvent.IsConfirmedByAuthor,
            isPlannedFinished,
            dbEvent.StartDate,
            dbEvent.EndDate,
            dbEvent.Chat is null ? Guid.Empty : dbEvent.Chat.Id,
            userResponse,
            (dbEvent.Details.Routes != null)
                ? dbEvent.Details.Routes
                    .Select(x => new PointDetailsDto(x.OrderId, new PointDto(x.Point.Lat, x.Point.Lon), x.Address))
                    .ToList()
                : [],
            dbEvent.Status);
    }
}
