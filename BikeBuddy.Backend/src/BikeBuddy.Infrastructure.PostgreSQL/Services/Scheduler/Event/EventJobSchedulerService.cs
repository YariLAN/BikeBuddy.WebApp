using BikeBuddy.Application.Jobs.Executor.Event;
using BikeBuddy.Application.Services.Scheduler.Event;
using Hangfire;

namespace BikeBuddy.Infrastructure.Services.Scheduler.Event;

public class EventJobSchedulerService : IEventJobSchedulerService
{
    public void Schedule(Guid eventId, Guid authorId, DateTime start, DateTime end)
    {
        var notifyStart = start.AddMinutes(-3);

        var notifyEnd = end.AddHours(1);

        if (notifyStart > DateTime.Now)
        {
            BackgroundJob.Schedule<IEventJobExecutor>(x =>
                x.NotifyAboutStartConfirmation(eventId, authorId, CancellationToken.None), notifyStart - DateTime.Now);

            BackgroundJob.Schedule<IEventJobExecutor>(x =>
                x.AutoConfirmStart(eventId, CancellationToken.None), start - DateTime.Now);
        }

        if (notifyEnd > DateTime.Now)
        {
            BackgroundJob.Schedule<IEventJobExecutor>(x =>
               x.NotifyAboutFinishConfirmation(eventId, CancellationToken.None), notifyEnd - DateTime.Now);
        }
    }
}
