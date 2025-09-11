namespace BikeBuddy.Application.DtoModels.Event;

public record EventFilterDto(
    int CountMembers,
    string StartAddress,
    List<string> ParticipantIds);
