using BikeBuddy.Application.Cache;
using BikeBuddy.Application.DtoModels.Event;
using ZiggyCreatures.Caching.Fusion;

namespace BikeBuddy.Infrastructure.Cache;

internal sealed class EventCache : CacheBase, IEventCache 
{
    protected override string Prefix => Constants.EVENTS;
    
    private readonly IFusionCache _internalCache;
    
    public EventCache(IFusionCache cache)
    {
        _internalCache = cache;
    }

    public ValueTask<(List<EventListResponse>, int)> GetManyAsync(int page, EventFilterDto filter, CancellationToken ct)
    {
        var key = GetCacheKey(page, filter);
        
        return _internalCache.GetOrDefaultAfterSetAsync(key, defaultValue: (new List<EventListResponse>(), 0), 
            ct: ct);
    }

    public ValueTask SetManyAsync(int page, EventFilterDto filter, (List<EventListResponse>, int) data, CancellationToken ct)
    {
        var key = GetCacheKey(page, filter);
        
        return _internalCache.SetAsync(key, data, token: ct);
    }

    private string GetCacheKey(int page, EventFilterDto filter)
        => BuildCacheKey(
            new("page", page.ToString()),
            new("start_address", filter.StartAddress),
            new("count_members", filter.CountMembers.ToString()),
            new("participant", filter.ParticipantIds.FirstOrDefault())
        );
}