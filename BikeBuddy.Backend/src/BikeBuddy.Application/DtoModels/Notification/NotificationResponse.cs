using BikeBuddy.Domain.Models.NotificationControl.ValueObject;

namespace BikeBuddy.Application.DtoModels.Notification;          

public record NotificationResponse(
    Guid Id,
    string Title,
    string Message,
    MessageType Type,
    bool IsRead,
    string Url,
    DateTime CreatedAt);
