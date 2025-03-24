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

public record PointDetails
{
    public int OrderId { get; }

    public Point Point { get; } = default!;

    public string Address { get; } = string.Empty;

    private PointDetails() { }

    private PointDetails(int orderId, Point point, string address)
    {
        OrderId = orderId;
        Point = point;
        Address = address;
    }

    public static Result<PointDetails, Error> Create(int orderId, string lat, string lon, string address)
    {
        if (string.IsNullOrWhiteSpace(address) || string.IsNullOrWhiteSpace(lat) || string.IsNullOrWhiteSpace(lon))
            return Error.Validation("Данные точки некорректны");

        var point = Point.Create(lat, lon);

        if (point.IsFailure)
            return point.Error;

        return new PointDetails(orderId, point.Value, address);
    }
}
