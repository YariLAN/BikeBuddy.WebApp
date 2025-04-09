using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;
using System.Collections.Concurrent;

namespace BikeBuddy.Application.Services.Chat.StateManagerService;

public class StateManagerService(IChatRepository chatRepository) : IStateManagerService
{
    private static readonly ConcurrentDictionary<Guid, HashSet<string>> ActiveUsers = [];

    public Task<List<Guid>> GetActiveUsersAsync(Guid groupChatId)
    {
        if (ActiveUsers.TryGetValue(groupChatId, out var connections))
        {
            return Task.FromResult(connections.Select(Guid.Parse).ToList());
        }

        return Task.FromResult( new List<Guid>() );
    }

    public async Task HandleDisconnectAsync(string connectionId)
    {
        foreach (var group in ActiveUsers)
        {
            if (group.Value.Contains(connectionId))
            {
                group.Value.Remove(connectionId);

                if (group.Value.Count == 0)
                    ActiveUsers.TryRemove(group.Key, out _);   
            }
        }
    }

    public async Task<Result<bool, Error>> JoinChatAsync(Guid groupChatId, Guid userId, string connectionId)
    {
        var chat = await chatRepository.GetByIdAsync(groupChatId, CancellationToken.None);

        if (chat.IsFailure)
            return chat.Error;

        var isMember = chatRepository.IsMemberOfChat(chat.Value, userId);
        if (isMember.IsFailure)
            return chat.Error;

        ActiveUsers.AddOrUpdate(groupChatId, 
            new HashSet<string> { connectionId }, 
            (_, connections) => { 
                connections.Add(connectionId); 
                return connections; 
            });

        return true;
    }

    public async Task<Result<bool, Error>> LeaveChatAsync(Guid groupChatId, Guid userId, string connectionId)
    {
        var chat = await chatRepository.GetByIdAsync(groupChatId, CancellationToken.None);

        if (chat.IsFailure)
            return chat.Error;

        var isMember = chatRepository.IsMemberOfChat(chat.Value, userId);
        if (isMember.IsFailure)
            return chat.Error;

        if (ActiveUsers.TryGetValue(groupChatId, out var connections))
        {
            connections.Remove(connectionId);

            if (connections.Count == 0)
                ActiveUsers.TryRemove(groupChatId, out _);
        }

        return true;
    }
}
