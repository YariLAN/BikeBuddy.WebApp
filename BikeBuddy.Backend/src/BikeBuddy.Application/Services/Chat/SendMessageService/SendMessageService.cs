using BikeBuddy.Application.DtoModels.Chat;
using BikeBuddy.Application.Mappers.Chat;
using BikeBuddy.Application.Services.Auth;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Application.Services.Chat.SendMessageService;

public class SendMessageService(
    IAuthRepository authRepository,
    IChatRepository chatRepository,
    IMessageRepository messageRepository) : ISendMessageService
{
    public async Task<Result<MessageDto, Error>> ExecuteAsync(SendMessageRequest request, CancellationToken cancellationToken)
    {
        var user = await authRepository.GetAsync(request.UserId, cancellationToken);
        if (user is null)
            return Errors.General.NotFound(request.UserId);

        var chat = await chatRepository.GetByIdAsync(request.GroupChatId, cancellationToken);

        if (chat.IsFailure)
            return chat.Error;

        var isMember = chatRepository.IsMemberOfChat(chat.Value, request.UserId);

        if (isMember.IsFailure)
            return isMember.Error;

        var createMessage = MessageMapper.ToMap(request);
        var result = await messageRepository.CreateAsync(createMessage, cancellationToken);

        if (result.IsFailure)
            return result.Error;

        chat.Value.UpdateLastMessageAt(createMessage.CreatedAt);
        var updateResult = await chatRepository.UpdateAsync(chat.Value, cancellationToken);

        if (updateResult.IsFailure)
            return updateResult.Error;

        return MessageMapper.ToMap(createMessage, user);
    }
}
