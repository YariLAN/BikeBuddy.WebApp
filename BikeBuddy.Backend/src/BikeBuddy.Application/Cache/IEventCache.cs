using BikeBuddy.Application.DtoModels.Common;
using BikeBuddy.Application.DtoModels.Event;

namespace BikeBuddy.Application.Cache;

/// <summary>
/// Кеш для событий
/// </summary>
public interface IEventCache
{
    /// <summary>
    /// Получить события на странице
    /// </summary>
    ValueTask<(List<EventListResponse>, int)> GetManyAsync(int page, EventFilterDto filter, CancellationToken cancellationToken);

    /// <summary>
    /// Установить кеш по указанной странице
    /// </summary>
    ValueTask SetManyAsync(int page, EventFilterDto filter, (List<EventListResponse>, int) data, CancellationToken cancellationToken);
}