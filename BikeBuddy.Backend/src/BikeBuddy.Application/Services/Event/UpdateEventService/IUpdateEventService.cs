using BikeBuddy.Application.DtoModels.Event;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;
using System.Security.Claims;

namespace BikeBuddy.Application.Services.Event.UpdateEventService;

public interface IUpdateEventService
{
    Task<Result<bool, Error>> ExecuteAsync(Guid eventId, UpdateEventRequest updateRequest, ClaimsPrincipal user, CancellationToken cancellationToken);
}
