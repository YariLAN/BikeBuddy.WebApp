using BikeBuddy.Application.DtoModels.Event;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;
using System.Security.Claims;

namespace BikeBuddy.Application.Services.Event.GetEventService;

public interface IGetEventService
{
    Task<Result<EventResponseDetails, Error>> ExecuteAsync(Guid eventId, ClaimsPrincipal user, CancellationToken cancellationToken);
}
