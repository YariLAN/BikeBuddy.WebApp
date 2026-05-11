using System.ClientModel;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.AI;
using OpenAI;
using OpenAI.Chat;

namespace BikeBuddy.Infrastructure.Clients.AIAssistant;

internal static class ServiceRegistry
{
    public static IServiceCollection AddAiAssistantClient(this IServiceCollection services)
    {
        services.AddChatClient(
            new ChatClient(
                model: "kimi-k2.6",
                credential: new ApiKeyCredential(""),
                options: new OpenAIClientOptions { Endpoint = new Uri("https://api.moonshot.ai/v1") })
            .AsIChatClient()
        );

        services.AddScoped<IAiAssistantClient, AiAssistantClient>();
        
        return services;
    }
}