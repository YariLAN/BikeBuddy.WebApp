using BikeBuddy.Domain.Models.EventControl.ValueObjects;

namespace BikeBuddy.Application.DtoModels.Event;

public record CreateEventRequest(
    string Name, 
    string Description, 
    EventType Type,
    BicycleType BicycleType,
    int CountMembers,
    int Distance,
    string StartAddress,
    string EndAddress,
    DateTime StartDate,
    DateTime EndDate,
    Guid UserId,
    IEnumerable<Point> Points,
    EventStatus Status);
