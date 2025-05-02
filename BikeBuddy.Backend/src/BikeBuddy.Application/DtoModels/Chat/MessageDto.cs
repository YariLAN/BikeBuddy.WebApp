namespace BikeBuddy.Application.DtoModels.Chat;

public record MessageDto(
    Guid Id,
    Guid GroupChatId,
    Guid? UserId,
    string? UserName,
    string Content,
    DateTime CreatedAt,
    string PhotoUrl = "");
