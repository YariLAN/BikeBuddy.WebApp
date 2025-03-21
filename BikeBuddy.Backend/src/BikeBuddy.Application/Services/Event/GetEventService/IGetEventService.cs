using BikeBuddy.Application.DtoModels.Event;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Application.Services.Event.GetEventService;

public interface IGetEventService
{
    Task<Result<EventResponse, Error>> ExecuteAsync(Guid eventId, CancellationToken cancellationToken);
}
