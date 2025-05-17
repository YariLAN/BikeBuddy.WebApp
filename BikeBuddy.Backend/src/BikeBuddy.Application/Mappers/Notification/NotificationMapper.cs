using BikeBuddy.Application.DtoModels.Notification;
using NotificationModel = BikeBuddy.Domain.Models.NotificationControl.Notification;

namespace BikeBuddy.Application.Mappers.Notification;

public class NotificationMapper
{
    public static NotificationModel ToMap(NotificationDto notificationDto)
    {
        return NotificationModel.Create(
            Guid.NewGuid(),
            notificationDto.AuthorId,
            notificationDto.Title,
            notificationDto.Message,
            notificationDto.Type,
            false,
            notificationDto.Url);
    }

    public static NotificationResponse ToMap(NotificationModel notification)
    {
        return new NotificationResponse(
            notification.Id, 
            notification.Title,
            notification.Message, 
            notification.Type,
            notification.IsRead, 
            notification.Url,
            notification.CreatedAt);
    }
}
