using BikeBuddy.Application.Services.Event;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Infrastructure.Repositories.Event;

public class EventRepository(ApplicationDbContext context) : IEventRepository
{
    public async Task<Result<Guid, Error>> CreateAsync(Domain.Models.EventControl.Event dbEvent, CancellationToken cancellationToken)
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
}
