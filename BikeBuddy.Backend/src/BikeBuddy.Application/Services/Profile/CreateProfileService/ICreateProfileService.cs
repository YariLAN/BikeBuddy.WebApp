﻿using BikeBuddy.Application.DtoModels.Profile;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Application.Services.Profile.CreateProfileService;

public interface ICreateProfileService
{
    Task<Result<bool, Error>> ExecuteAsync(UserProfileRequest request, CancellationToken cancellationToken);
}
