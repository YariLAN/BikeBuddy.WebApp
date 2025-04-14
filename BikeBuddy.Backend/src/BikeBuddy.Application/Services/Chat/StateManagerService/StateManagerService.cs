using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;
using System.Collections.Concurrent;

namespace BikeBuddy.Application.Services.Chat.StateManagerService;

public class StateManagerService(IChatRepository chatRepository) : IStateManagerService
{
    private static readonly ConcurrentDictionary<Guid, ConcurrentDictionary<Guid, HashSet<string>>> ActiveUsers = [];

    public Task<List<Guid>> GetActiveUsersAsync(Guid groupChatId)
    {
        return Task.FromResult(
            ActiveUsers.TryGetValue(groupChatId, out var users) 
            ? users.Keys.ToList() 
            : []);
    }

    public async Task HandleDisconnectAsync(string connectionId)
    {
        foreach (var (groupChatId, users) in ActiveUsers)
        {
            foreach (var (userId, connections) in users)
            {
                if (connections.Contains(connectionId))
                {
                    connections.Remove(connectionId);

                    if (connections.Count == 0)
                        users.TryRemove(userId, out _);
                }    
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

        ActiveUsers
            .GetOrAdd(groupChatId, _ => new ConcurrentDictionary<Guid, HashSet<string>>())
            .AddOrUpdate(userId, 
                new HashSet<string> { connectionId }, 
                (_, connections) => { 
                    connections.Add(connectionId); 
                    return connections; 
                });

        return true;
    }

    public async Task<Result<bool, Error>> LeaveChatAsync(Guid groupChatId, Guid userId, string connectionId)
    {
        if (!ActiveUsers.TryGetValue(groupChatId, out var users))
            return true;

        var chat = await chatRepository.GetByIdAsync(groupChatId, CancellationToken.None);

        if (chat.IsFailure)
            return chat.Error;

        var isMember = chatRepository.IsMemberOfChat(chat.Value, userId);
        if (isMember.IsFailure)
            return chat.Error;

        var userEntry = users.FirstOrDefault(u => u.Value.Contains(connectionId));
        if (userEntry.Value is null)
            return true;

        userEntry.Value.Remove(connectionId);

        // Если это было последнее подключение пользователя
        if (userEntry.Value.Count == 0)
            users.TryRemove(userEntry.Key, out _);

        // Если в чате не осталось пользователей
        if (users.IsEmpty)
            ActiveUsers.TryRemove(groupChatId, out _);

        return true;
    }
}
