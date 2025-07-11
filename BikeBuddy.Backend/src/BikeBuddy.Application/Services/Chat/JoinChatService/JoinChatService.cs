﻿using BikeBuddy.Application.Services.Auth;
using BikeBuddy.Domain.Models.ChatControl.ValueObjects;
using BikeBuddy.Domain.Models.EventControl.ValueObjects;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;
using System.Security.Claims;
using static BikeBuddy.Domain.Shared.Errors;

namespace BikeBuddy.Application.Services.Chat.JoinChatService;

public class JoinChatService(
    IAuthRepository authRepository,
    IChatRepository chatRepository) : IJoinChatService
{
    public async Task<Result<bool, Error>> ExecuteAsync(Guid chatId, ClaimsPrincipal user, CancellationToken cancellationToken)
    {
        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;

        if (string.IsNullOrWhiteSpace(userId))
            return General.NotFound();

        var authUser = await authRepository.GetAsync(Guid.Parse(userId), cancellationToken);

        if (authUser is null) 
            return General.NotFound(Guid.Parse(userId));

        var chat = await chatRepository.GetByIdAsync(chatId, cancellationToken);

        if (chat.IsFailure) return chat.Error;

        var isMemberChat = chatRepository.IsMemberOfChat(chat.Value, authUser.Id);
        if (isMemberChat.IsSuccess)
            return Errors.Chat.AlreadyMember(authUser.Id);

        if (chat.Value.Event!.CountMembers == chat.Value.Members.Count)
        {
            return Errors.Chat.CountMembersExceeded(authUser.Id);
        }
        else if (chat.Value.Event!.CountMembers - chat.Value.Members.Count == 1)
        {
            chat.Value.Event!.UpdateStatus(EventStatus.CLOSED);
        }

        chat.Value.AddMember(authUser.Id, Role.MEMBER);
        var updateResult = await chatRepository.UpdateAsync(chat.Value, cancellationToken);
       
        if (updateResult.IsFailure) 
            return updateResult.Error;

        return updateResult.Value;
    }
}
