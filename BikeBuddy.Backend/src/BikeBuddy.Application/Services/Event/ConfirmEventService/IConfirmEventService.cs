using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Application.Services.Event.ConfirmEventService;

public interface IConfirmEventService
{
    Task<Result<bool, Error>> ExecuteConfirmStartAsync(Guid eventId, CancellationToken cancellationToken);

    Task<Result<bool, Error>> ExecuteConfirmFinishAsync(Guid eventId, CancellationToken cancellationToken);
}
