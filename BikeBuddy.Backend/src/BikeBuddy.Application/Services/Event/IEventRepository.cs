using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Application.Services.Event;

public interface IEventRepository
{
    Task<Result<Guid, Error>> CreateAsync(Domain.Models.EventControl.Event dbEvent, CancellationToken cancellationToken);
}
