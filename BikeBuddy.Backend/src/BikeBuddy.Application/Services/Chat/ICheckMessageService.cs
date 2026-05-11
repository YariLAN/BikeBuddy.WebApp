using System.Text.Json.Serialization;

namespace BikeBuddy.Application.Services.Chat;

public interface ICheckMessageService
{
    Task<CheckMessageResponse> CheckAsync(CheckMessageRequest request, CancellationToken ct = default);
}

public record CheckMessageRequest(string Text);

public class CheckMessageResponse
{
    [JsonPropertyName("correctedText")]
    public string CorrectedText { get; set; } = string.Empty;

    [JsonPropertyName("errorCount")]
    public int ErrorCount { get; set; }

    [JsonPropertyName("errors")]
    public List<CheckMessageErrorResponse> Errors { get; set; } = [];
}

public class CheckMessageErrorResponse
{
    [JsonPropertyName("original")]
    public string Original { get; set; } = string.Empty;

    [JsonPropertyName("corrected")]
    public string Corrected { get; set; } = string.Empty;

    [JsonPropertyName("type")]
    public CheckMessageType Type { get; set; }

    [JsonPropertyName("explanation")]
    public string Explanation { get; set; } = string.Empty;
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum CheckMessageType
{
    [JsonPropertyName("spelling")]
    Spelling,

    [JsonPropertyName("punctuation")]
    Punctuation,

    [JsonPropertyName("grammar")]
    Grammar,
}
