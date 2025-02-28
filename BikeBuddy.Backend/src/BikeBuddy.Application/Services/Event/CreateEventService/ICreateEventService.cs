using BikeBuddy.Application.DtoModels.Event;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Application.Services.Event.CreateEventService;

public interface ICreateEventService
{
    Task<Result<Guid, Error>> ExecuteAsync(CreateEventRequest request, CancellationToken cancellationToken);
}
