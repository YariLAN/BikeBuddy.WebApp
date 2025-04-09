using BikeBuddy.Domain.Models.ChatControl.ValueObjects;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;
using System.Security.Claims;
using static BikeBuddy.Domain.Shared.Errors;

namespace BikeBuddy.Application.Services.Chat.LeaveChatService;

public class LeaveChatService(IChatRepository chatRepository) : ILeaveChatService
{
    public async Task<Result<bool, Error>> ExecuteAsync(Guid chatId, ClaimsPrincipal user, CancellationToken cancellationToken)
    {
        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
        if (string.IsNullOrWhiteSpace(userId))
            return General.NotFound();

        var chat = await chatRepository.GetByIdAsync(chatId, cancellationToken);

        if (chat.IsFailure) return chat.Error;

        var member = chat.Value.Members.FirstOrDefault(m => m == Guid.Parse(userId));
        if (member is null)
            return General.NotFound(Guid.Parse(userId));

        if (member.Role == Role.AUTHOR) 
            return Errors.Chat.AuthorCannotLeave(member.UserId);

        chat.Value.RemoveMember(member);
        var updateResult = await chatRepository.UpdateAsync(chat.Value, cancellationToken);

        if (updateResult.IsFailure)
            return updateResult.Error;

        return updateResult.Value;
    }
}
