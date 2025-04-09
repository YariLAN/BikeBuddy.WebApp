using BikeBuddy.Application.DtoModels.Chat;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Application.Services.Chat.SendMessageService;

public interface ISendMessageService
{
    Task<Result<MessageDto, Error>> ExecuteAsync(SendMessageRequest request, CancellationToken cancellationToken);
}
