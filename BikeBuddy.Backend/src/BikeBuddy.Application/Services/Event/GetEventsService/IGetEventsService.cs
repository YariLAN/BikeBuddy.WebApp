using BikeBuddy.Application.DtoModels.Common;
using BikeBuddy.Application.DtoModels.Event;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Application.Services.Event.GetEventsService;

public interface IGetEventsService
{
    Task<Result<PageData<EventListResponse>, Error>> ExecuteAsync(SearchFilterDto<EventFilterDto> request, CancellationToken cancellationToken);
}
