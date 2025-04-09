using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;
using System.Security.Claims;

namespace BikeBuddy.Application.Services.Chat.JoinChatService;

public interface IJoinChatService
{
    Task<Result<bool, Error>> ExecuteAsync(Guid chatId, ClaimsPrincipal user, CancellationToken cancellationToken); 
}
