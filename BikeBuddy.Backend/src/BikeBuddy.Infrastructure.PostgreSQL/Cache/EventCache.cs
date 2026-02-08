using System.Text.Json;
using BikeBuddy.Application.Cache;
using BikeBuddy.Application.DtoModels.Event;
using ZiggyCreatures.Caching.Fusion;

namespace BikeBuddy.Infrastructure.Cache;

internal sealed class EventCache : IEventCache
{
    private readonly IFusionCache _internalCache;

    private const string KEY_PAGE = "{0}-page:{1}-filters:{2}";
    
    public EventCache(IFusionCache cache)
    {
        _internalCache = cache;
    }

    public ValueTask<(List<EventListResponse>, int)> GetManyAsync(int page, EventFilterDto filter, CancellationToken ct)
    {
        return _internalCache.GetOrDefaultAfterSetAsync(
            key: String.Format(KEY_PAGE, Constants.EVENTS, page, JsonSerializer.Serialize(filter)),
            defaultValue: (new List<EventListResponse>(), 0), 
            ct: ct);
    }

    public ValueTask SetManyAsync(int page, EventFilterDto filter, (List<EventListResponse>, int) data, CancellationToken ct)
    {
        return _internalCache.SetAsync(
            key: String.Format(KEY_PAGE, Constants.EVENTS, page, JsonSerializer.Serialize(filter)), 
            data, 
            token: ct);
    }
}