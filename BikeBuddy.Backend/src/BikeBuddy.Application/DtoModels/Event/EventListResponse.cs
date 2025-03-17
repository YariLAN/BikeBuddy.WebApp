using BikeBuddy.Domain.Models.EventControl.ValueObjects;

namespace BikeBuddy.Application.DtoModels.Event;

public record EventListResponse(
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
    string NameAuthor,
    EventStatus Status,
    string ImageUrl);
