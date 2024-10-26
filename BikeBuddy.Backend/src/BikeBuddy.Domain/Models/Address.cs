namespace BikeBuddy.Domain.Models;

public record Address
{
    public string Country { get; } = string.Empty;

    public string City { get; } = string.Empty;

    private Address() { }

    private Address(string city, string country)
    {
        City = city;
        Country = country;
    }

    public static Address Create(string city, string country)
    {
        return new Address(city, country);
    }

    public static Address New() => Create("", "");
}
