using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;
using System.Security.Claims;

namespace BikeBuddy.Application.Services.Chat.LeaveChatService;

public interface ILeaveChatService
{
    Task<Result<bool, Error>> ExecuteAsync(Guid chatId, ClaimsPrincipal user, CancellationToken cancellationToken);
}
