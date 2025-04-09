using BikeBuddy.Application.DtoModels.Chat;
using BikeBuddy.Application.Mappers.Chat;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Application.Services.Chat.GetChatMessagesService;

public class GetChatMessagesService(
    IMessageRepository messageRepository, 
    IChatRepository chatRepository) : IGetChatMessagesService
{
    public async Task<Result<List<MessageDto>, Error>> ExecuteAsync(Guid groupChatId, Guid userId, CancellationToken cancellationToken = default)
    {
        var chat = await chatRepository.GetByIdAsync(groupChatId, cancellationToken);

        if (chat.IsFailure)
            return chat.Error;

        var isMember = chatRepository.IsMemberOfChat(chat.Value, userId);
        if (isMember.IsFailure)
            return isMember.Error;

        var messages = chat.Value
            .GetMessages()
            .ConvertAll(c => MessageMapper.ToMap(c, c.AuthUser));

        return messages;
    }
}
