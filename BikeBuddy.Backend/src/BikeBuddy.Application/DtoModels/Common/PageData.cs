using System.Text.Json.Serialization;

namespace BikeBuddy.Application.DtoModels.Common;

public class PageData<T>
{
    private PageData(List<T> body, int totalCount)
    {
        Body = body;
        TotalCount = totalCount;
    }
    
    [JsonPropertyName("body")]
    public List<T> Body { get; set; } = [];

    [JsonPropertyName("total")]
    public int TotalCount { get; set; }

    public static PageData<T> Create(List<T> body, int totalCount)
        => new(body, totalCount);
}
