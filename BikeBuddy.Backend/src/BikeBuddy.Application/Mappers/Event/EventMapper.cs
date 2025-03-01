using BikeBuddy.Application.DtoModels.Event;
using BikeBuddy.Domain.Models.EventControl.ValueObjects;

namespace BikeBuddy.Application.Mappers.Event;

internal class EventMapper
{
    public static Domain.Models.EventControl.Event ToMap(CreateEventRequest request, IEnumerable<Point> points)
    {
        return Domain.Models.EventControl.Event.Create(
            id: Guid.NewGuid(),
            name: request.Name,
            description: request.Description,
            type: request.Type,
            bicycleType: request.BicycleType,
            countMembers: request.CountMembers,
            distance: request.Distance,
            startAddress: request.StartAddress,
            endAddress: request.EndAddress,
            startDate: request.StartDate,
            endDate: request.EndDate,
            details: EventDetails.Create(points),
            status: request.Status,
            createdBy: request.UserId);
    }
}
