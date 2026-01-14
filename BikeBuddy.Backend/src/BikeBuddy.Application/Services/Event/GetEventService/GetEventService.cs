using BikeBuddy.Application.DtoModels.Event;
using BikeBuddy.Application.Mappers.Event;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;
using System.Security.Claims;
using BikeBuddy.Application.Services.Common.S3;

namespace BikeBuddy.Application.Services.Event.GetEventService;

public sealed class GetEventService(IEventRepository eventRepository, IS3Provider fileProvider) : IGetEventService
{
    public async Task<Result<EventResponseDetails, Error>> ExecuteAsync(Guid eventId, ClaimsPrincipal user, CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var dbEventResult = await eventRepository.GetEventAsync(eventId, cancellationToken);

        if (dbEventResult.IsFailure)
            return dbEventResult.Error;

        var isMemberChat = dbEventResult.Value.Chat?.Members?.Any(user => user == userId) ?? false;

        var filesResult = await fileProvider.GetAllByObjectAsync(
            Files.BucketNameConstants.EVENT_IMAGES,
            $"{dbEventResult.Value.Id}",
            cancellationToken);

        var files = filesResult.IsSuccess
            ? filesResult.Value.Where(f
                => !f.FileName.EndsWith(Files.FileNameConstants.MAP_IMAGE_FILENAME)).ToList()
            : [];

        return new EventResponseDetails(
            Event: EventMapper.ToMap(dbEventResult.Value, files), 
            CanEdit: userId == dbEventResult.Value.CreatedBy,
            IsMemberChat: isMemberChat
        ); 
    }
}
