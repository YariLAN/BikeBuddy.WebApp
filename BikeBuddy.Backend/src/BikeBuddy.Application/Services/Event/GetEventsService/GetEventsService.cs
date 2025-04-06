using BikeBuddy.Application.DtoModels.Common;
using BikeBuddy.Application.DtoModels.Event;
using BikeBuddy.Application.Mappers.Event;
using BikeBuddy.Application.Services.Common;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Application.Services.Event.GetEventsService;

public class GetEventsService(
    IEventRepository eventRepository, 
    IFileProvider fileProvider) : IGetEventsService
{
    public async Task<Result<PageData<EventListResponse>, Error>> ExecuteAsync(SearchFilterDto<EventFilterDto> request, CancellationToken cancellationToken)
    {
        // получение данных по фильтрам
        var result = await eventRepository.GetEventsByFilterAsync(request, cancellationToken);

        if (result.IsFailure)
            return result.Error;

        var (events, count) = result.Value;

        // маппинг в dto
        var eventDtos = new List<EventListResponse>();

        foreach (var dbEvent in events)
        {
            var fileName = $"{dbEvent.Id}/{Files.FileNameConstants.MAP_IMAGE_FILENAME}";

            var imageUrlResult = await fileProvider.GetFileByFileNamesAsync(fileName, Files.BucketNameConstants.EVENT_IMAGES, cancellationToken);

            var imageUrl = imageUrlResult.IsSuccess ? imageUrlResult.Value : string.Empty;

            eventDtos.Add(EventMapper.ToMap(dbEvent, imageUrl));
        }

        return new PageData<EventListResponse>
        {
            Body = eventDtos,
            TotalCount = count
        };
    }
}
