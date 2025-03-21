using BikeBuddy.Application.DtoModels.Event;
using BikeBuddy.Application.Mappers.Event;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Application.Services.Event.GetEventService;

public class GetEventService(IEventRepository eventRepository) : IGetEventService
{
    public async Task<Result<EventResponse, Error>> ExecuteAsync(Guid eventId, CancellationToken cancellationToken)
    {
        var dbEventResult = await eventRepository.GetEventAsync(eventId, cancellationToken);

        if (dbEventResult.IsFailure)
            return dbEventResult.Error;

        return EventMapper.ToMap(dbEventResult.Value);
    }
}
