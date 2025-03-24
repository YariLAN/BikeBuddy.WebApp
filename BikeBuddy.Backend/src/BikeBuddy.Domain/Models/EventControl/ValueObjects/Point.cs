using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Domain.Models.EventControl.ValueObjects;

public record Point
{
    public string Lat { get; } = string.Empty;

    public string Lon { get; } = string.Empty;

    private Point() { }

    private Point(string lat, string lon)
    {
        Lat = lat;
        Lon = lon;
    }

    public static Result<Point, Error> Create(string lat, string lon)
    {
        if (string.IsNullOrWhiteSpace(lat) || string.IsNullOrWhiteSpace(lon))
            return Error.Validation("Координата точки некорректна"); ;

        return new Point(lat, lon);
    }
}

//public record PointDetails
//{
//    public int OrderId { get; }
//    public Point Point { get; }

//    public string Address { get; } = string.Empty;
//}
