using BikeBuddy.Domain.Models.ChatControl;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Application.Services.Chat;

public interface IChatRepository
{
    Task<Result<Guid, Error>> CreateAsync(GroupChat chat, CancellationToken cancellationToken);
}
