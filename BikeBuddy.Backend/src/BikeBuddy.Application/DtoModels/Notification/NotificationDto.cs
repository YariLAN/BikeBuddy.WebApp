using BikeBuddy.Domain.Models.NotificationControl.ValueObject;

namespace BikeBuddy.Application.DtoModels.Notification;

public record NotificationDto(
    Guid AuthorId, 
    string Title,
    string Message, 
    string Url = "", 
    MessageType Type = MessageType.Info);
