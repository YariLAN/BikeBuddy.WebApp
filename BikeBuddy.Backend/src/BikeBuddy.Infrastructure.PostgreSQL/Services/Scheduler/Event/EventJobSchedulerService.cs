using BikeBuddy.Application.Jobs.Executor.Event;
using BikeBuddy.Application.Services.Scheduler.Event;
using Hangfire;
using Hangfire.Storage.Monitoring;

namespace BikeBuddy.Infrastructure.Services.Scheduler.Event;

public class EventJobSchedulerService(JobStorage _jobStorage) : IEventJobSchedulerService
{
    public void Schedule(Guid eventId, Guid authorId, DateTime start, DateTime end, CancellationToken cancellationToken = default)
    {
        var notifyStart = start.AddHours(-3);

        var notifyEnd = end.AddHours(1);
        var repeatNotifyEnd = notifyEnd.AddHours(4);

        var delay = notifyStart - DateTime.Now;
        if (DateTime.Now <= start)
            BackgroundJob.Schedule<IEventJobExecutor>(x =>
                x.NotifyAboutStartConfirmation(eventId, authorId, cancellationToken), delay > TimeSpan.Zero ? delay : TimeSpan.Zero);

        if (start > DateTime.Now)
            BackgroundJob.Schedule<IEventJobExecutor>(x =>
                x.AutoConfirmStart(eventId, cancellationToken), start - DateTime.Now);                                          

        if (notifyEnd > DateTime.Now)
            BackgroundJob.Schedule<IEventJobExecutor>(x =>
               x.NotifyAboutFinishConfirmation(eventId, cancellationToken), notifyEnd - DateTime.Now);

        if (repeatNotifyEnd > DateTime.Now)
        {
            BackgroundJob.Schedule<IEventJobExecutor>(x =>
               x.RepeatFinishNotification(eventId, authorId, cancellationToken), repeatNotifyEnd - DateTime.Now);

            BackgroundJob.Schedule<IEventJobExecutor>(x =>
               x.AutoComplete(eventId, cancellationToken), end.AddHours(24) - DateTime.Now);
        }
    }

    public void DeleteJobsForEvent(Guid eventId, CancellationToken cancellationToken = default)
    {
        var scheduledJobs = _jobStorage.GetMonitoringApi().ScheduledJobs(0, int.MaxValue)
            .Where(j => IsJobForEvent(j.Value, eventId))
            .Select(j => j.Key);

        foreach (var jobId in scheduledJobs)
        {
            BackgroundJob.Delete(jobId);
        }

        return;
    }

    private bool IsJobForEvent(ScheduledJobDto job, Guid eventId)
    {
        try
        {
            return job.Job?.Args?.Any(a => 
                a is Guid id && id == eventId) == true;
        }
        catch 
        { 
            return false; 
        }
    }
}
