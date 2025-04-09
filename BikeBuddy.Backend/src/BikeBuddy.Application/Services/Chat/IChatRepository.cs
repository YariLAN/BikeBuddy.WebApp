using BikeBuddy.Domain.Models.ChatControl;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Application.Services.Chat;

public interface IChatRepository
{
    Task<Result<Guid, Error>> CreateAsync(GroupChat chat, CancellationToken cancellationToken);

    Task<Result<GroupChat, Error>> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    Task<Result<bool, Error>> UpdateAsync(GroupChat chat, CancellationToken cancellationToken);

    Result<bool, Error> IsMemberOfChat(GroupChat chat, Guid userId);
}
