﻿namespace BikeBuddy.Application.DtoModels.Auth;

public record RegisterRequest(string Email, string Password, string UserName);
