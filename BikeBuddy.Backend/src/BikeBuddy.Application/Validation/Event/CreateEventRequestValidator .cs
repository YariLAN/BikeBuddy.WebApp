using BikeBuddy.Application.DtoModels.Event;
using BikeBuddy.Domain.Models.EventControl.ValueObjects;
using BikeBuddy.Domain.Shared;
using FluentValidation;

namespace BikeBuddy.Application.Validation.Event;

public class CreateEventRequestValidation : AbstractValidator<CreateEventRequest>
{
    public CreateEventRequestValidation()
    {
        ClassLevelCascadeMode = CascadeMode.StopOnFirstFailure;

        RuleFor(e => e.Name)
            .NotNull()
            .NotEmpty()
            .WithError(Errors.General.ValueIsEmpty("Name"))
            .MaximumLength(Constants.LOW_TEXT_LENGTH)
            .WithError(Errors.General.ValueIsInvalidLength("Name"));

        RuleFor(e => e.Description)
            .MaximumLength(Constants.HIGH_TEXT_LENGTH)
            .WithError(Errors.General.ValueIsInvalidLength("Description"))
            .NotEmpty()
            .WithError(Errors.General.ValueIsEmpty("Description"));

        RuleFor(e => e.Type).IsInEnum()
            .WithError(Errors.General.ValueIsInvalid("Type"));

        RuleFor(e => e.BicycleType).IsInEnum()
            .WithError(Errors.General.ValueIsInvalid("BicycleType"));

        RuleFor(e => e.CountMembers).GreaterThan(0)
            .WithError(Errors.General.ValueIsInvalid("CountMembers"));   

        RuleFor(e => e.Distance).GreaterThan(0)
            .WithError(Errors.General.ValueIsInvalid("Distance"));
        
        RuleFor(e => e.StartAddress).MaximumLength(Constants.LOW_TEXT_LENGTH + 100)
            .WithError(Errors.General.ValueIsInvalidLength("StartAddress"));         
        
        RuleFor(e => e.EndAddress).MaximumLength(Constants.LOW_TEXT_LENGTH + 100)
            .WithError(Errors.General.ValueIsInvalidLength("StartAddress"));
                                                                                            
        RuleFor(e => e.StartDate).LessThanOrEqualTo(e => e.EndDate)
            .WithError(Errors.Event.DateRangeIsInvalid("StartDate"));
                                                                               
        RuleFor(e => e.EndDate).GreaterThanOrEqualTo(e => e.StartDate)
            .WithError(Errors.Event.DateRangeIsInvalid("EndDate"));

        RuleFor(e => e.UserId).NotEmpty().NotNull()
            .WithError(Errors.General.ValueIsEmpty("UserId"));

        RuleForEach(e => e.Points).MustBeValueObject(x => PointDetails.Create(x.OrderId, x.Point.Lat, x.Point.Lon, x.Address));

        RuleFor(e => e.Status).IsInEnum().WithError(Errors.General.ValueIsInvalid("Status"));
    }
}
