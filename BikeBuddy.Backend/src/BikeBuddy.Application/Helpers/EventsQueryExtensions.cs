using BikeBuddy.Application.DtoModels.Event;
using BikeBuddy.Domain.Models.EventControl;

namespace BikeBuddy.Application.Helpers;

public static class EventsQueryExtensions
{
    public static IQueryable<Event> ApplyFilters(this IQueryable<Event> query, EventFilterDto? filter)
    {
        if (filter != null)
        {
            if (filter.CountMembers > 0)
            {
                query = query.Where(e => e.CountMembers == filter.CountMembers);
            }

            if (!string.IsNullOrEmpty(filter.StartAddress)) {
                query = query.Where(e => e.StartAddress.Contains(filter.StartAddress));
            }

            if (filter.ParticipantIds.Count > 0)
            {
                query = query.Where(e => e.Chat.Members.Any(
                    m => filter.ParticipantIds.Contains(m.UserId.ToString())));
            } 
        }

        return query;
    }
}