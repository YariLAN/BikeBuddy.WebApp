using Microsoft.Extensions.AI;

namespace BikeBuddy.Infrastructure.Clients.AIAssistant;

public class AiAssistantCompleteRequest
{
    /// <summary>
    /// Сообщения для модели.
    /// </summary>
    public required IReadOnlyList<AiRequestMessage> Messages { get; set; }

    /// <summary>
    /// Переопределение модели; если не задано — используется модель по умолчанию из конфигурации.
    /// </summary>
    public string? Model { get; set; }

    /// <summary>
    /// Системный промпт.
    /// </summary>
    public string? SystemPrompt { get; set; }
}

public sealed class AiRequestMessage
{
    /// <summary>
    /// Роль: system, user, assistant и т.д.
    /// </summary>
    public required ChatRole Role { get; set; }

    /// <summary>
    /// Текстовое содержимое сообщения.
    /// </summary>
    public required string Message { get; set; }
}
