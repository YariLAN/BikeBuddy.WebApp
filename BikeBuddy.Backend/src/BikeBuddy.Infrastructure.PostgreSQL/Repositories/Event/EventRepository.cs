using BikeBuddy.Application.DtoModels.Common;
using BikeBuddy.Application.DtoModels.Event;
using BikeBuddy.Application.Services.Event;
using BikeBuddy.Domain.Models.ChatControl;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;
using Microsoft.EntityFrameworkCore;
using static BikeBuddy.Domain.Shared.Errors;
using EventModel = BikeBuddy.Domain.Models.EventControl.Event;

namespace BikeBuddy.Infrastructure.Repositories.Event;

public class EventRepository(ApplicationDbContext context) : IEventRepository
{
    public async Task<Result<Guid, Error>> CreateAsync(EventModel dbEvent, CancellationToken cancellationToken)
    {
        try
        {
            await context.Events.AddAsync(dbEvent, cancellationToken);

            await context.SaveChangesAsync(cancellationToken);

            return dbEvent.Id;
        }
        catch
        {
            return Error.Failure("Ошибка добавления заезда");
        }
    }

    public async Task<Result<EventModel, Error>> GetEventAsync(Guid eventId, CancellationToken token)
    {
        var dbEvent = await context.Events
            .Include(x => x.Chat)
            .Include(x => x.User)
                .ThenInclude(u => u.UserProfile)
            .Include(x => x.Chat)
                .ThenInclude(x => x.Members)
            .FirstOrDefaultAsync(e => e.Id == eventId);

        return dbEvent != null ? dbEvent : General.NotFound(eventId);
    }

    public async Task<Result<(List<EventModel>, int), Error>> GetEventsByFilterAsync(SearchFilterDto<EventFilterDto> eventFilter, CancellationToken cancellationToken)
    {
        try
        {
            IQueryable<EventModel> events = context.Events.Include(e => e.User).AsNoTracking();

            if (eventFilter.Filter != null)
            {
                if (eventFilter.Filter.CountMembers > 0)
                {
                    events = events.Where(e => e.CountMembers == eventFilter.Filter.CountMembers);
                }
            }

            return (
              await events
                .OrderBy(x => x.CreatedAt)
                .Skip(eventFilter.Offset)
                .Take(eventFilter.Limit)
                .ToListAsync(cancellationToken),
              await events.CountAsync(cancellationToken));
        }
        catch
        {
            return Error.Failure("Ошибка получения заездов");
        }
    }
}
