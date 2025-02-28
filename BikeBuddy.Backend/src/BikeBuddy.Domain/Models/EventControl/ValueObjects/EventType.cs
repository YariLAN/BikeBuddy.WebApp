namespace BikeBuddy.Domain.Models.EventControl.ValueObjects;

public enum EventType
{
    // Индивидуальный заезд
    SOLO,

    // Групповой заезд
    GROUP,

    // Гонка
    RACE,

    // Прогулка
    LEISURE,

    // Тренировка
    TRAINING,

    // Испытание
    CHALLENGE,

    // Велотур
    TOUR,
}
