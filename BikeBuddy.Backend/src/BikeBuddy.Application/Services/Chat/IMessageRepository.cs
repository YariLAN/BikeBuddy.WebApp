using BikeBuddy.Domain.Models.ChatControl.Entities;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Application.Services.Chat;

public interface IMessageRepository
{
    Task<Result<Guid, Error>> CreateAsync(Message message, CancellationToken cancellationToken);
}
