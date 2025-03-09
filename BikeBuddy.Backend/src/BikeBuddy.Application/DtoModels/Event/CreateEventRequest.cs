using BikeBuddy.Domain.Models.EventControl.ValueObjects;

namespace BikeBuddy.Application.DtoModels.Event;

public record CreateEventRequest(
    string Name, 
    string Description, 
    EventType Type,
    BicycleType BicycleType,
    int CountMembers,
    double Distance,
    string StartAddress,
    string EndAddress,
    DateTime StartDate,
    DateTime EndDate,
    Guid UserId,
    IEnumerable<PointDto> Points,
    EventStatus Status);

public record PointDto(string Lat, string Lon);