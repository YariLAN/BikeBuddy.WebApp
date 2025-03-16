using BikeBuddy.Application.DtoModels.Profile;
using BikeBuddy.Domain.Models.EventControl.ValueObjects;

namespace BikeBuddy.Application.DtoModels.Event;

public record EventResponse(
    Guid eventId,
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
    UserProfileResponse Author,
    IEnumerable<PointDto> Points,
    EventStatus Status);
