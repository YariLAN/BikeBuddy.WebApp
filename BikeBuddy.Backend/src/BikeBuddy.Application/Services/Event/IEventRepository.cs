using BikeBuddy.Application.DtoModels.Common;
using BikeBuddy.Application.DtoModels.Event;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;
using EventDomain = BikeBuddy.Domain.Models.EventControl.Event;

namespace BikeBuddy.Application.Services.Event;

public sealed record EventsRecord(List<EventDomain> Event, int TotalCount);

public interface IEventRepository
{
    Task<Result<Guid, Error>> CreateAsync(EventDomain dbEvent, CancellationToken cancellationToken);

    Task<Result<EventDomain, Error>> GetEventAsync(Guid eventId, CancellationToken token);

    Task<Result<EventsRecord, Error>> GetEventsByFilterAsync(SearchFilterDto<EventFilterDto> eventFilter, CancellationToken token);

    Task<Result<bool, Error>> UpdateAsync(EventDomain eventModel, CancellationToken cancellationToken);
}
