using Microsoft.Extensions.AI;

namespace BikeBuddy.Infrastructure.Clients.AIAssistant;

public interface IAiAssistantClient
{
    /// <summary>
    /// Сгенерировать ответ языковой модели
    /// </summary>
    Task<ChatResponse?> CompleteAsync(AiAssistantCompleteRequest request, CancellationToken ct = default);
}