using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

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

    public static Result<Address, Error> Create(string address)
    {
        if (string.IsNullOrWhiteSpace(address))
            return Create("", "");

        var parts = address.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

        if (parts.Length != 2)
            return Error.Validation("Адресная строка состоит только из страны и города.");

        var city = parts[0];
        var country = parts[1];

        return Create(city, country);
    }

    public override string ToString()
    {
        return $"{City}, {Country}".Trim(new[] { ',', ' ' });
    }

    public static Address New() => Create("", "");
}
