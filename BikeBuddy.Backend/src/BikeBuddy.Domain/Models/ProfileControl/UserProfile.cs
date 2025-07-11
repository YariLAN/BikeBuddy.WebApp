﻿using BikeBuddy.Domain.Models.AuthControl;
using BikeBuddy.Domain.Models.ProfileControl.ValueObjects;
using BikeBuddy.Domain.Shared;

namespace BikeBuddy.Domain.Models.ProfileControl;

public class UserProfile
{
    public Guid Id { get; set; }

    public Guid UserId { get; private set; }

    public string Surname { get; private set; } = string.Empty;

    public string Name { get; private set; } = string.Empty;

    public string MiddleName { get; private set; } = string.Empty;

    public DateTime? BirthDay { get; private set; }

    public Address Address { get; private set; } = Address.Create("", "");

    public string PhotoUrl { get; private set; } = string.Empty;

    public AuthUser AuthUser { get; private set; } = default!;

    private UserProfile() { }

    private UserProfile(Guid id, Guid userId, string surname, string name, string middleName, DateTime? birthDay, Address address)
    {
        Id = id;
        UserId = userId;
        Surname = surname;
        Name = name;
        MiddleName = middleName;
        BirthDay = birthDay;
        Address = address;
    }

    public static UserProfile Create(
        Guid id,
        Guid userId,
        string surname,
        string name,
        string middleName,
        DateTime? birthDay,
        Address address)
    {
        return new UserProfile(id, userId, surname, name, middleName, birthDay, address);
    }

    public void Update(
        string surname,
        string name,
        string middleName,
        DateTime? birthDay,
        Address address)
    {
        Surname = surname;
        Name = name;
        MiddleName = middleName;
        BirthDay = birthDay;
        Address = address;
    }

    public void UpdatePhoto(string photoUrl)
    {
        PhotoUrl = photoUrl;
        BirthDay = BirthDay?.ToUTC();
    }
}
