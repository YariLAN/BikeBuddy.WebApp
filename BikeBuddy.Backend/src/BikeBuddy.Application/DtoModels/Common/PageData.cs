using System.Text.Json.Serialization;

namespace BikeBuddy.Application.DtoModels.Common;

public class PageData<T>
{
    [JsonPropertyName("body")]
    public List<T> Body { get; set; } = [];

    [JsonPropertyName("total")]
    public int TotalCount { get; set; }
}
