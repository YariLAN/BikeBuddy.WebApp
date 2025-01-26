﻿using BikeBuddy.Domain.Models;

namespace BikeBuddy.Application.DtoModels.Profile;

public record UserProfileRequest(Guid UserId, string Surname, string Name, string MiddleName, DateTime? BirthDay, string Address);
