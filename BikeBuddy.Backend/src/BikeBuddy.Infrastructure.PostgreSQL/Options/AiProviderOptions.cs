namespace BikeBuddy.Infrastructure.Options;

internal sealed class AiProviderOptions
{
    public const string OptionName = "AiProvider";
    
    public string? ServerUrl { get; set; }
    
    public string? Model { get; set; }
    
    public string? ApiToken { get; set; }

    public string ServerUrlRequired 
        => ServerUrl ?? throw new ArgumentNullException();

    public string ModelRequired
        => Model ?? throw new ArgumentNullException();
    
    public string ApiTokenRequired => ApiToken ?? throw new ArgumentNullException();
}