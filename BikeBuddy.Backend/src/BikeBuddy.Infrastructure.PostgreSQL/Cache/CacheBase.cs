namespace BikeBuddy.Infrastructure.Cache;

public sealed record KeyValueRecord(string Key, string? Value);

internal abstract class CacheBase
{
    protected abstract string Prefix { get; }

    protected virtual string BuildCacheKey(params KeyValueRecord[] parts)
    {
        var keyValues = parts
            .Where(p => !string.IsNullOrEmpty(p.Value))
            .OrderBy(p => p.Key)
            .Select(p => $"{p.Key}={p.Value}");

        return $"{Prefix}:{string.Join(":", keyValues)}";
    }
}