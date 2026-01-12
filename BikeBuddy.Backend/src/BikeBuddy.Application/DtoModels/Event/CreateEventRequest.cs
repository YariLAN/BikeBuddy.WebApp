using BikeBuddy.Domain.Models.EventControl.ValueObjects;
using Microsoft.AspNetCore.Http;

namespace BikeBuddy.Application.DtoModels.Event;

public abstract record EventRequest(
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
    IEnumerable<PointDetailsDto> Points);

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
    IEnumerable<PointDetailsDto> Points,
    Guid UserId,
    EventStatus Status,
    IReadOnlyList<IFormFile>? Files) 
    : EventRequest(Name, Description, Type, BicycleType, CountMembers, Distance, StartAddress, EndAddress, StartDate, EndDate, Points);