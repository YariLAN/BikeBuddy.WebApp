using BikeBuddy.Domain.Models.AuthControl;
using BikeBuddy.Domain.Models.ChatControl;
using BikeBuddy.Domain.Models.EventControl.ValueObjects;

namespace BikeBuddy.Domain.Models.EventControl;

public class Event : ICreatedUpdateAt
{
    public Guid Id { get; set; }

    public string Name { get; private set; } = string.Empty;

    public string Description { get; private set; } = string.Empty;

    public EventType Type { get; private set; } = EventType.GROUP;

    public BicycleType BicycleType { get; private set; } = BicycleType.ANY;

    public int CountMembers { get; private set; }

    public int Distance { get; private set; }

    public string StartAddress { get; private set; } = string.Empty;

    public string EndAddress { get; private set; } = string.Empty;

    public DateTime StartDate { get; private set; }

    public DateTime EndDate { get; private set; }

    public EventDetails Details { get; private set; } = default!;

    public EventStatus Status { get; set; } = EventStatus.OPENED;

    public Guid? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
    
    public AuthUser User { get; private set; } = default!;

    public GroupChat Chat { get; set; } = default!;

    public Event() { }

    private Event(
        Guid id,
        string name,
        string description,
        EventType type,
        BicycleType bicycleType,
        int countMembers,
        int distance,
        string startAddress,
        string endAddress,
        DateTime startDate,
        DateTime endDate,
        EventDetails details,
        EventStatus status,
        Guid createdBy)
    {
        Name = name;
        Description = description;
        Type = type;
        BicycleType = bicycleType;
        CountMembers = countMembers;
        Distance = distance;
        StartAddress = startAddress;
        EndAddress = endAddress;
        StartDate = startDate;
        EndDate = endDate;
        Details = details;
        Status = status;
        CreatedBy = createdBy;
    }

    public static Event Create(
        Guid id,
        string name,
        string description,
        EventType type,
        BicycleType bicycleType,
        int countMembers,
        int distance,
        string startAddress,
        string endAddress,
        DateTime startDate,
        DateTime endDate,
        EventDetails details,
        EventStatus status,
        Guid createdBy)
    {
        return new Event(
            id,
            name, 
            description, 
            type, 
            bicycleType, 
            countMembers,
            distance, 
            startAddress,
            endAddress, 
            startDate, 
            endDate,
            details, 
            status, 
            createdBy);
    }
}
