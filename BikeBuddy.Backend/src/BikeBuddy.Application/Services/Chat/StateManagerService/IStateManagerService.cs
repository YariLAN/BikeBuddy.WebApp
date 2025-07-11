﻿using BikeBuddy.Application.DtoModels.User;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Application.Services.Chat.StateManagerService;

public interface IStateManagerService
{
    Task<Result<bool, Error>> JoinChatAsync(Guid groupChatId, Guid userId, string connectionId);

    Task<Result<bool, Error>> LeaveChatAsync(Guid groupChatId, Guid userId, string connectionId);

    Task<List<UserResponse>> GetActiveUsersAsync(Guid groupChatId);

    Task HandleDisconnectAsync(string connectionId);
}
