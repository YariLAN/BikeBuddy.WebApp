using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Application.Jobs.Executor.Event;

public interface IEventJobExecutor
{
    Task<Result<bool, Error>> NotifyAboutStartConfirmation(Guid eventId, Guid authorId, CancellationToken cancellationToken);

    Task<Result<bool, Error>> AutoConfirmStart(Guid eventId, CancellationToken cancellationToken);

    Task<Result<bool, Error>> NotifyAboutFinishConfirmation(Guid eventId, CancellationToken cancellationToken);

    Task<Result<bool, Error>> AutoComplete(Guid eventId, CancellationToken cancellationToken);

    Task<Result<bool, Error>> RepeatFinishNotification(Guid eventId, Guid authorId, CancellationToken cancellationToken);
}
