using BikeBuddy.Application.Services.Chat;
using BikeBuddy.Infrastructure.Clients.AIAssistant;
using Microsoft.Extensions.AI;

namespace BikeBuddy.Infrastructure.Services.Chat;

internal sealed class CheckMessageService(IAiAssistantClient assistantClient) : ICheckMessageService
{
    public async Task<CheckMessageResponse> CheckAsync(CancellationToken ct = default)
    {
        var result = await assistantClient.CompleteAsync(new AiAssistantCompleteRequest()
        {
            Messages = [new() { Message = "Сколько будет 2 + 2?", Role = ChatRole.User }],
            SystemPrompt = ""
        });

        return new CheckMessageResponse(result?.Text ?? "");
    }
}