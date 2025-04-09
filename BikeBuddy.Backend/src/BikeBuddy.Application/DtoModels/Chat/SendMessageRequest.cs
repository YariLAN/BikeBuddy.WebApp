namespace BikeBuddy.Application.DtoModels.Chat;

public record SendMessageRequest(
    Guid GroupChatId,
    Guid UserId,
    string Content);
