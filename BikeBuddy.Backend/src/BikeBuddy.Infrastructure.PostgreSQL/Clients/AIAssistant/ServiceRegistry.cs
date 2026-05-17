using System.ClientModel;
using BikeBuddy.Infrastructure.Options;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.AI;
using Microsoft.Extensions.Configuration;
using OpenAI;
using OpenAI.Chat;

namespace BikeBuddy.Infrastructure.Clients.AIAssistant;

internal static class ServiceRegistry
{
    public static IServiceCollection AddAiAssistantClient(
        this IServiceCollection services, 
        IConfiguration configuration)
    {
        var section = configuration.GetRequiredSection(AiProviderOptions.OptionName);
        
        services.Configure<AiProviderOptions>(section);
        var options = section.Get<AiProviderOptions>() ?? throw new ArgumentNullException();
        
        services.AddChatClient(
            new ChatClient(
                model: options.ModelRequired,
                credential: new ApiKeyCredential(options.ApiTokenRequired),
                options: new OpenAIClientOptions
                {
                    Endpoint = new Uri(options.ServerUrlRequired)
                })
            .AsIChatClient()
        );

        services.AddScoped<IAiAssistantClient, AiAssistantClient>();
        
        return services;
    }
}