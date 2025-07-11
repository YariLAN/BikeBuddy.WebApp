﻿using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;
using Microsoft.AspNetCore.Mvc;

namespace BikeBuddy.API.Shared.Extensions;

public static class ResponseExtensions
{
    public static ActionResult ToResponse(this Error error)
    {
        var statusCode = error.Type switch
        {
            ErrorType.Validation   => StatusCodes.Status400BadRequest,
            ErrorType.Conflict     => StatusCodes.Status409Conflict,
            ErrorType.NotFound     => StatusCodes.Status404NotFound,
            ErrorType.Failure      => StatusCodes.Status500InternalServerError,
            ErrorType.Unauthorized => StatusCodes.Status401Unauthorized,
            ErrorType.Forbidden    => StatusCodes.Status403Forbidden,

            _ => StatusCodes.Status500InternalServerError,
        };

        return new ObjectResult(error)
        {
            StatusCode = statusCode,
        };
    }

    public static ActionResult<T> ToResponse<T>(this Result<T, Error> result)
    {
        if (result.IsFailure)
            return result.Error.ToResponse();

        return new OkObjectResult(result.Value);
    }

    public static ActionResult ToValidationResponse(this List<Error> errors)
    {
        return new ObjectResult(errors[0])
        {
            StatusCode = StatusCodes.Status400BadRequest,
        };
    }
}
