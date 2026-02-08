using ZiggyCreatures.Caching.Fusion;

namespace BikeBuddy.Infrastructure.Cache;

internal static class FusionCacheExtension
{
    public static ValueTask<T?> GetOrDefaultAfterSetAsync<T>(
        this IFusionCache cache,
        string key,
        T? defaultValue = default,
        CancellationToken ct = default)
    {
        return cache.GetOrSetAsync(
            key,
            defaultValue: defaultValue,
            token: ct);
    }
}