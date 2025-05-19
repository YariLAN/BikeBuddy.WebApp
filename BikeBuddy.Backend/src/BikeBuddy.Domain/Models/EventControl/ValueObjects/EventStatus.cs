namespace BikeBuddy.Domain.Models.EventControl.ValueObjects;

public enum EventStatus
{
    // Открыто
    OPENED,

    // Закрыто для присоединения
    CLOSED,

    // Заезд стартовал
    STARTED,

    // Пройдено
    COMPLETED,

    // Отменено
    CANCELLED,
}
