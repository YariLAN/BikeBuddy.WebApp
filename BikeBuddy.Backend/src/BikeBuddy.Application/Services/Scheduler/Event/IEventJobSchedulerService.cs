namespace BikeBuddy.Application.Services.Scheduler.Event;

public interface IEventJobSchedulerService
{
    void Schedule(Guid eventId, Guid authorId, DateTime start, DateTime end);
}
