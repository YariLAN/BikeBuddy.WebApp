using BikeBuddy.Application.DtoModels.Profile;
using BikeBuddy.Domain.Models.ProfileControl;
using BikeBuddy.Domain.Shared;
using FluentValidation;

namespace BikeBuddy.Application.Validation.Profile;

public class UserProfileRequestValidator : AbstractValidator<UserProfileRequest>
{
    public UserProfileRequestValidator()
    {
        RuleFor(p => p.Surname)
            .MaximumLength(Constants.LOW_TEXT_LENGTH)
            .WithError(Errors.General.ValueIsInvalidLength("Surname"))
            .NotEmpty()
            .WithError(Errors.General.ValueIsEmpty("Surname"));

        RuleFor(p => p.Name)
            .MaximumLength(Constants.HIGH_TEXT_LENGTH)
            .WithError(Errors.General.ValueIsInvalidLength("Name"))
            .NotEmpty()
            .WithError(Errors.General.ValueIsEmpty("Name"));          
        
        RuleFor(p => p.MiddleName)
            .MaximumLength(Constants.HIGH_TEXT_LENGTH)
            .WithError(Errors.General.ValueIsInvalidLength("MiddleName"))
            .NotEmpty()
            .WithError(Errors.General.ValueIsEmpty("Name"));

        RuleFor(p => p.Address).MustBeValueObject(Address.Create);
    }
}
