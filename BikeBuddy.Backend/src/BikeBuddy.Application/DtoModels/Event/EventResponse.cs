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
    int CurrentCountMembers,
    double Distance,
    string StartAddress,
    string EndAddress,
    DateTime StartDate,
    DateTime EndDate,
    Guid ChatId,
    UserResponse Author,
    IEnumerable<PointDetailsDto> Points,
    EventStatus Status);

public record EventResponseDetails(
    EventResponse Event,
    bool CanEdit,
    bool IsMemberChat);
