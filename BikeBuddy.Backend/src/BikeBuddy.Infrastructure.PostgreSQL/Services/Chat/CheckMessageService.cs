using System.Text.Json;
using BikeBuddy.Application.Services.Chat;
using BikeBuddy.Infrastructure.Clients.AIAssistant;
using Microsoft.Extensions.AI;

namespace BikeBuddy.Infrastructure.Services.Chat;

internal sealed class CheckMessageService(IAiAssistantClient assistantClient) : ICheckMessageService
{
    private const string SYSTEM_PROMPT = 
        """
        Ты — профессиональный корректор текста.
        Найди орфографические и грамматические ошибки.
        Пунктуационные и стилистические замечания игнорируй.
        
        Обязательно, вникай в контекст предложений.
        
        Верни ТОЛЬКО JSON без markdown и пояснений:
        {
          "errors": [
            {
              "original": "слово с ошибкой",
              "corrected": "правильное слово",
              "type": "spelling|grammar",
              "explanation": "краткое объяснение"
            }
          ],
          "correctedText": "полный исправленный текст",
          "errorCount": 2
        }
        
        Если ошибок нет — errors: [], errorCount: 0.
        Объяснения ошибок (поле explanation) всегда пиши на русском языке,
        независимо от языка проверяемого текста.
        """;
    
    public async Task<CheckMessageResponse> CheckAsync(CheckMessageRequest request, CancellationToken ct)
    {
        var result = await assistantClient.CompleteAsync(new AiAssistantCompleteRequest()
        {
            Messages = [new() { Message = request.Text, Role = ChatRole.User }],
            SystemPrompt = SYSTEM_PROMPT
        }, ct);
        
        var clean = result?.Text ?? ""
            .Replace("```json", "")
            .Replace("```", "")
            .Trim();

        var checkMessage = JsonSerializer.Deserialize<CheckMessageResponse>(clean);

        return checkMessage 
               ?? new CheckMessageResponse { CorrectedText = request.Text, Errors = [], ErrorCount = 0 };
    }
}