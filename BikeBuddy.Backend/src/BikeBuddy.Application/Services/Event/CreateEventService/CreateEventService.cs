using BikeBuddy.Application.DtoModels.Event;
using BikeBuddy.Application.Mappers.Event;
using BikeBuddy.Application.Services.Auth;
using BikeBuddy.Application.Services.Common.S3;
using BikeBuddy.Application.Services.Scheduler.Event;
using BikeBuddy.Domain.Models.EventControl.ValueObjects;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Application.Services.Event.CreateEventService;

public sealed class CreateEventService(
    IAuthRepository authRepository, 
    IEventRepository eventRepository,
    IS3Provider fileProvider,
    IEventJobSchedulerService _eventJobSchedulerService) : ICreateEventService
{
    public async Task<Result<Guid, Error>> ExecuteAsync(CreateEventRequest request, CancellationToken cancellationToken)
    {
        var points = request.Points
            .Select(p => PointDetails.Create(p.OrderId, p.Point.Lat, p.Point.Lon, p.Address))
            .Select(x => x.Value);

        var userId = await authRepository.GetAsync(request.UserId, cancellationToken);

        if (userId is null)
            return Errors.General.NotFound(request.UserId);
        
        var dbEvent = EventMapper.ToMap(request, points);

        var eventResult = await eventRepository.CreateAsync(dbEvent, cancellationToken);

        if (eventResult.IsFailure) 
            return eventResult.Error;
        
        var resultFile = await fileProvider.UploadFilesAsync(
            request.Files?.ToList() ?? [], 
            Files.BucketNameConstants.EVENT_IMAGES,  
            $"{eventResult.Value}",
            cancellationToken);

        if (resultFile.IsFailure)
            return resultFile.Error;

        _eventJobSchedulerService.Schedule(eventResult.Value, userId.Id, dbEvent.StartDate, dbEvent.EndDate, cancellationToken);

        return eventResult.Value;
    }
}
