using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Serialization;

namespace BikeBuddy.Application.DtoModels.Common;

public class SearchDto
{
    [JsonPropertyName("offset")]
    public int Offset { get; set; } = 0;

    [JsonPropertyName("limit")]
    public int Limit { get; set; } = 10;
}

public class SearchFilterDto<T> : SearchDto where T : class
{
    [JsonPropertyName("filter")]
    public T? Filter { get; set; }
}
