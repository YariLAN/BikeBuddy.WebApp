using BikeBuddy.Application.DtoModels.User;
using BikeBuddy.Domain.Models.EventControl.ValueObjects;

namespace BikeBuddy.Application.DtoModels.Event;

public record EventResponse(
    Guid EventId,
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
    UserResponse Author,
    IEnumerable<PointDto> Points,
    EventStatus Status);
