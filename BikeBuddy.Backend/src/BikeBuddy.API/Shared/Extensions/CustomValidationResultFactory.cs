using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using SharpGrip.FluentValidation.AutoValidation.Mvc.Results;
using BikeBuddy.Domain.Shared;

namespace BikeBuddy.API.Shared.Extensions;

public class CustomValidationResultFactory : IFluentValidationAutoValidationResultFactory
{
    public IActionResult CreateActionResult(
      ActionExecutingContext context,
      ValidationProblemDetails? validationProblemDetails)
    {
        if (validationProblemDetails is null)
        {
            throw new InvalidOperationException("ValidationProblemDetails is null");
        }

        List<Error> errorResponses = [];

        foreach (var (propertyName, errors) in validationProblemDetails.Errors)
        {
            foreach (var error in errors)
            {
                var errorDeserialize = Error.Deserialize(error);

                errorResponses.Add((errorDeserialize));
            };
        }

        return errorResponses.ToValidationResponse();
    }
}