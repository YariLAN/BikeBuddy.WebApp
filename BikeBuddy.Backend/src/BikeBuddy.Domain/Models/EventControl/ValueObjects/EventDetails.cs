namespace BikeBuddy.Domain.Models.EventControl.ValueObjects;

public record EventDetails
{
    public IReadOnlyList<Point> Routes { get; }

    public EventDetails() { }

    public EventDetails(IEnumerable<Point> points)
    {
        Routes = points.ToList();
    }

    public static EventDetails Create(IEnumerable<Point> points)
    {
        return new EventDetails(points);
    }
}
