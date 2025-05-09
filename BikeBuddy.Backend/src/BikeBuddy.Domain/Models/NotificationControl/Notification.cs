using BikeBuddy.Domain.Models.AuthControl;
using BikeBuddy.Domain.Models.NotificationControl.ValueObject;

namespace BikeBuddy.Domain.Models.NotificationControl;

public class Notification : ICreatedUpdateAt
{
    public Guid Id { get; private set; }

    public Guid UserId { get; private set; }

    public string Message { get; private set; } = string.Empty;

    public MessageType Type { get; private set; }

    public bool IsRead { get; private set; }

    public string Url { get; private set; } = string.Empty; 

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public AuthUser AuthUser { get; private set; }

    public Notification() { }

    private Notification(Guid id,
        Guid userId, 
        string message, 
        MessageType type, 
        bool isRead,
        string url = "")
    {
        Id = id;
        UserId = userId;
        Message = message;
        Type = type;
        IsRead = isRead;
        Url = url;
    }

    public static Notification Create(Guid id, Guid userId, string message, MessageType type, bool isRead, string url = "")
    {
        return new Notification(id, userId, message, type, isRead, url);
    }
}
