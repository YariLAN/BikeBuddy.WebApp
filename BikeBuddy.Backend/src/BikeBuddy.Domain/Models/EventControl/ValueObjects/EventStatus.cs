namespace BikeBuddy.Domain.Models.EventControl.ValueObjects;

public enum EventStatus
{
    // Открыто
    OPENED,

    // Закрыто для присоединения
    CLOSED,

    // Пройдено
    COMPLETED,

    // Отменено
    CANCELLED,
}
