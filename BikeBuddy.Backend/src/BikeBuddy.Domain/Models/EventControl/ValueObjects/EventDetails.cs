namespace BikeBuddy.Domain.Models.EventControl.ValueObjects;

public record EventDetails
{
    public IReadOnlyList<PointDetails> Routes { get; }

    public EventDetails() { }

    public EventDetails(IEnumerable<PointDetails> points)
    {
        Routes = points.ToList();
    }

    public static EventDetails Create(IEnumerable<PointDetails> points)
    {
        return new EventDetails(points);
    }
}
