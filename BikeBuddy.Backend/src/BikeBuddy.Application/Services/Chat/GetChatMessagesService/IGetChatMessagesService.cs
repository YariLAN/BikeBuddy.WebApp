using BikeBuddy.Application.DtoModels.Chat;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Application.Services.Chat.GetChatMessagesService;

public interface IGetChatMessagesService
{
    Task<Result<List<MessageDto>, Error>> ExecuteAsync(Guid groupChatId, Guid userId, CancellationToken cancellationToken = default);
}