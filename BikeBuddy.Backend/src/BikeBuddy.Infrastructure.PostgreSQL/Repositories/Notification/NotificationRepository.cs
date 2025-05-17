using BikeBuddy.Application.Services.Common.Notification;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;
using Microsoft.EntityFrameworkCore;

using NotificationModel = BikeBuddy.Domain.Models.NotificationControl.Notification;

namespace BikeBuddy.Infrastructure.Repositories.Notification;

public class NotificationRepository(ApplicationDbContext context) : INotificationRepository
{
    public async Task<Result<Guid, Error>> CreateAsync(NotificationModel notification, CancellationToken cancellationToken)
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

    public async Task<Result<(List<NotificationModel>, int), Error>> GetAllByUserAsync(Guid userId, CancellationToken cancellationToken)
    {
        var notifications = await context.Notifications
            .AsNoTracking()
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync(cancellationToken);

        return (notifications, notifications.Count); 
    }

    public async Task<Result<NotificationModel, Error>> GetAsync(Guid notificationId, CancellationToken cancellationToken)
    {
        var notification = await context.Notifications
            .FirstOrDefaultAsync(n => n.Id == notificationId, cancellationToken);

        if (notification is null)
            return Errors.General.NotFound(notificationId);

        return notification;
    }

    public async Task<Result<bool, Error>> MarkAllAsReadAsync(Guid userId, CancellationToken cancellationToken)
    {
        try
        {
            IQueryable<NotificationModel> notifications = context.Notifications.Where(n => n.UserId == userId && !n.IsRead);

            if (!await notifications.AnyAsync())
                return true;

            await notifications.ExecuteUpdateAsync(n => n.SetProperty(n => n.IsRead, true), cancellationToken);

            return true;
        }
        catch (Exception ex)
        {
            return Error.Failure($"Ошибка обновления уведомлений: {ex.Message}");
        }
    }

    public async Task<Result<bool, Error>> UpdateAsync(NotificationModel notification, CancellationToken cancellationToken)
    {
        try
        {
            await context.SaveChangesAsync(cancellationToken);
            return true;
        } catch (Exception ex)
        {
            return Error.Failure($"Ошибка обновления уведомления: {ex.Message}");
        }
    }
}
