namespace BikeBuddy.Application.Services.Scheduler.Event;

public interface IEventJobSchedulerService
{
    void Schedule(Guid eventId, Guid authorId, DateTime start, DateTime end, CancellationToken cancellationToken = default);

    void DeleteJobsForEvent(Guid eventId, CancellationToken cancellationToken = default);
}
