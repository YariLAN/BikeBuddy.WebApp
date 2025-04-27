using BikeBuddy.Domain.Models.EventControl.ValueObjects;

namespace BikeBuddy.Application.DtoModels.Event;

public record UpdateEventRequest(
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
    IEnumerable<PointDetailsDto> Points)
    : EventRequest(Name, Description, Type, BicycleType, CountMembers, Distance, StartAddress, EndAddress, StartDate, EndDate, Points);
