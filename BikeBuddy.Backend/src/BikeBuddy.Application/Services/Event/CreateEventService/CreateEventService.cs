using BikeBuddy.Application.DtoModels.Event;
using BikeBuddy.Application.Mappers.Event;
using BikeBuddy.Application.Services.Auth;
using BikeBuddy.Domain.Models.EventControl.ValueObjects;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Application.Services.Event.CreateEventService;

public class CreateEventService(
    IAuthRepository authRepository, 
    IEventRepository eventRepository) : ICreateEventService
{
    public async Task<Result<Guid, Error>> ExecuteAsync(CreateEventRequest request, CancellationToken cancellationToken)
    {
        // Validation

        var points = request.Points.Select(p => Point.Create(p.Lat, p.Lon));

        if (points.Any(x => x.IsFailure))
            return points.FirstOrDefault(x => x.IsFailure)!.Error;

        if (points.Count() <= 0)
            return Error.Validation("Маршрут не построен");

        // Validation

        var userId = await authRepository.GetAsync(request.UserId, cancellationToken);

        if (userId is null)
            return Error.NotFound("Пользователь не найден");

        var dbEvent = EventMapper.ToMap(request);

        var eventResult = await eventRepository.CreateAsync(dbEvent, cancellationToken);

        if (eventResult.IsFailure)
            return eventResult.Error;

        return eventResult.Value;
    }
}
