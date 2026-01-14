using BikeBuddy.Application.DtoModels.User;
using BikeBuddy.Domain.Models.EventControl.ValueObjects;
using FileInfo = BikeBuddy.Application.DtoModels.Files.FileInfo;

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
    bool? IsCorfirmedByAuthor,
    bool IsPlannedFinished,
    DateTime StartDate,
    DateTime EndDate,
    Guid ChatId,
    UserResponse Author,
    IEnumerable<PointDetailsDto> Points,
    IReadOnlyList<FileInfo> Images,
    EventStatus Status);