using BikeBuddy.Application.Cache;
using BikeBuddy.Application.DtoModels.Common;
using BikeBuddy.Application.DtoModels.Event;
using BikeBuddy.Application.Mappers.Event;
using BikeBuddy.Application.Services.Common.S3;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Application.Services.Event.GetEventsService;

public sealed class GetEventsService(
    IEventRepository eventRepository, 
    IS3Provider fileProvider,
    IEventCache cache) : IGetEventsService
{
    public async Task<Result<PageData<EventListResponse>, Error>> ExecuteAsync(SearchFilterDto<EventFilterDto> request, CancellationToken cancellationToken)
    {
        var page = (int)Math.Floor((double)request.Offset / request.Limit) + 1;
        
        var (eventDtos, count) = await cache.GetManyAsync(page, request.Filter, cancellationToken);
        if (eventDtos.Count > 0)
        {
            return PageData<EventListResponse>.Create(eventDtos, count);
        }
        
        var result = await eventRepository.GetEventsByFilterAsync(request, cancellationToken);
        
        if (result.IsFailure) 
            return result.Error;
        
        foreach (var dbEvent in result.Value.Event)
        { 
            var fileName = $"{dbEvent.Id}/{Files.FileNameConstants.MAP_IMAGE_FILENAME}";
            
            var imageUrlResult = await fileProvider.GetFileByFileNamesAsync(fileName, Files.BucketNameConstants.EVENT_IMAGES, cancellationToken);
            var imageUrl = imageUrlResult.IsSuccess ? imageUrlResult.Value : string.Empty;

            eventDtos.Add(EventMapper.ToMap(dbEvent, imageUrl));
        }

        await cache.SetManyAsync(page, request.Filter, (eventDtos, result.Value.TotalCount), cancellationToken);

        return PageData<EventListResponse>.Create(eventDtos, result.Value.TotalCount);
    }
}
