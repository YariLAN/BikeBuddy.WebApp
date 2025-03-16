using BikeBuddy.Application.DtoModels.Common;
using BikeBuddy.Application.DtoModels.Event;
using BikeBuddy.Application.Services.Event;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;
using Microsoft.EntityFrameworkCore;
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

    public Task<Result<List<EventModel>, Error>> GetEventsAsync(CancellationToken token)
    {
        throw new NotImplementedException();
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
