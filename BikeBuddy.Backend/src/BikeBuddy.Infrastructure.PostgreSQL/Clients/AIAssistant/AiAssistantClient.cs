using Microsoft.Extensions.AI;

namespace BikeBuddy.Infrastructure.Clients.AIAssistant;

internal sealed class AiAssistantClient(IChatClient chatClient) : IAiAssistantClient
{
    public async Task<ChatResponse?> CompleteAsync(AiAssistantCompleteRequest request, CancellationToken ct)
    {
        var messages = BuildMessages(request);
        var options = request.Model is not null
            ? new ChatOptions { 
                ModelId = request.Model 
            }
            : null;

        var response = await chatClient.GetResponseAsync(messages, options, ct);

        return response;
    }

    private static IReadOnlyList<ChatMessage> BuildMessages(AiAssistantCompleteRequest request)
    {
        var messages = new List<ChatMessage>();

        if (!String.IsNullOrWhiteSpace(request.SystemPrompt))
        {
            messages.Add(new ChatMessage(ChatRole.System, request.SystemPrompt));
        }

        messages.AddRange(request.Messages
            .Select(message
                => new ChatMessage(message.Role, message.Message)));

        return messages;
    }
}