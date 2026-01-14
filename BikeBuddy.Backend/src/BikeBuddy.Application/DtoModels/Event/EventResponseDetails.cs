namespace BikeBuddy.Application.DtoModels.Event;

/// <summary>
/// Доп данные о заезде
/// </summary>
/// <param name="Event">Заезд</param>
/// <param name="CanEdit">Можно ли редактировать заезд</param>
/// <param name="IsMemberChat">Является ли пользователь членом чата</param>
public record EventResponseDetails(
    EventResponse Event,
    bool CanEdit,
    bool IsMemberChat);