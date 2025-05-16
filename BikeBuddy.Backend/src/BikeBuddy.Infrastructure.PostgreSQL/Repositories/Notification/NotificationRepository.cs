using BikeBuddy.Application.Services.Common.Notification;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Infrastructure.Repositories.Notification;

public class NotificationRepository(ApplicationDbContext context) : INotificationRepository
{
    public async Task<Result<Guid, Error>> CreateAsync(Domain.Models.NotificationControl.Notification notification, CancellationToken cancellationToken)
    {
        try
        {
            await context.Notifications.AddAsync(notification, cancellationToken);

            await context.SaveChangesAsync(cancellationToken);

            return notification.Id;
        }
        catch
        {
            return Error.Failure("Ошибка добавления заезда");
        }
    }
}
