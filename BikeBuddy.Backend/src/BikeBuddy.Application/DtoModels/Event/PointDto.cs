namespace BikeBuddy.Application.DtoModels.Event;

public record PointDto(string Lat, string Lon);

public record PointDetailsDto(int OrderId, PointDto Point, string Address);