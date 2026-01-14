namespace BikeBuddy.Infrastructure.Options;

public sealed class OAuthGoogleOption
{
    public const string OPTION_NAME = "Authentication:Google";

    public string ClientId { get; set; } = string.Empty;

    public string ClientSecret { get; set; } = string.Empty;
}