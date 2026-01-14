using BikeBuddy.Application.DtoModels.Event;
using BikeBuddy.Application.Mappers.Event;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;
using System.Security.Claims;
using BikeBuddy.Application.Services.Common;

namespace BikeBuddy.Application.Services.Event.GetEventService;

public class GetEventService(IEventRepository eventRepository, IFileProvider fileProvider) : IGetEventService
{
    public async Task<Result<EventResponseDetails, Error>> ExecuteAsync(Guid eventId, ClaimsPrincipal user, CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var dbEventResult = await eventRepository.GetEventAsync(eventId, cancellationToken);

        if (dbEventResult.IsFailure)
            return dbEventResult.Error;

        var isMemberChat = dbEventResult.Value.Chat?.Members?.Any(user => user == userId) ?? false;

        var files = await fileProvider.GetAllByObjectAsync(
            Files.BucketNameConstants.EVENT_IMAGES,
            $"{dbEventResult.Value.Id}",
            cancellationToken);

        return new EventResponseDetails(
            Event: EventMapper.ToMap(dbEventResult.Value, files.Value), 
            CanEdit: userId == dbEventResult.Value.CreatedBy,
            IsMemberChat: isMemberChat
        ); 
    }
}
