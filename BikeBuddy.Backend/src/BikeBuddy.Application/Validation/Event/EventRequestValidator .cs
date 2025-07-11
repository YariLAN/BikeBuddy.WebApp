﻿using BikeBuddy.Application.DtoModels.Event;
using BikeBuddy.Domain.Models.EventControl.ValueObjects;
using BikeBuddy.Domain.Shared;
using FluentValidation;

namespace BikeBuddy.Application.Validation.Event;

public static class EventValidationRules
{
    public static void ApplyCommonRules<T>(this AbstractValidator<T> validator)
        where T : EventRequest
    {
        validator.RuleFor(e => e.Name)
            .NotNull()
            .NotEmpty()
            .WithError(Errors.General.ValueIsEmpty("Name"))
            .MaximumLength(Constants.LOW_TEXT_LENGTH)
            .WithError(Errors.General.ValueIsInvalidLength("Name"));

        validator.RuleFor(e => e.Description)
            .MaximumLength(Constants.HIGH_TEXT_LENGTH)
            .WithError(Errors.General.ValueIsInvalidLength("Description"))
            .NotEmpty()
            .WithError(Errors.General.ValueIsEmpty("Description"));

        validator.RuleFor(e => e.Type).IsInEnum()
            .WithError(Errors.General.ValueIsInvalid("Type"));

        validator.RuleFor(e => e.BicycleType).IsInEnum()
            .WithError(Errors.General.ValueIsInvalid("BicycleType"));

        validator.RuleFor(e => e.CountMembers).GreaterThan(0)
            .WithError(Errors.General.ValueIsInvalid("CountMembers"));   

        validator.RuleFor(e => e.Distance).GreaterThan(0)
            .WithError(Errors.General.ValueIsInvalid("Distance"));
        
        validator.RuleFor(e => e.StartAddress).MaximumLength(Constants.LOW_TEXT_LENGTH + 100)
            .WithError(Errors.General.ValueIsInvalidLength("StartAddress"));         
        
        validator.RuleFor(e => e.EndAddress).MaximumLength(Constants.LOW_TEXT_LENGTH + 100)
            .WithError(Errors.General.ValueIsInvalidLength("StartAddress"));
                                                                                            
        validator.RuleFor(e => e.StartDate).LessThanOrEqualTo(e => e.EndDate)
            .WithError(Errors.Event.DateRangeIsInvalid("StartDate"));
                                                                               
        validator.RuleFor(e => e.EndDate).GreaterThanOrEqualTo(e => e.StartDate)
            .WithError(Errors.Event.DateRangeIsInvalid("EndDate"));

        validator.RuleForEach(e => e.Points).MustBeValueObject(x => PointDetails.Create(x.OrderId, x.Point.Lat, x.Point.Lon, x.Address));
    }
}

public class CreateEventRequestValidation : AbstractValidator<CreateEventRequest>
{
    public CreateEventRequestValidation()
    {
        ClassLevelCascadeMode = CascadeMode.StopOnFirstFailure;

        this.ApplyCommonRules();

        RuleFor(e => e.UserId).NotEmpty().NotNull()
            .WithError(Errors.General.ValueIsEmpty("UserId"));

        RuleFor(e => e.Status).IsInEnum().WithError(Errors.General.ValueIsInvalid("Status"));
    }
}
      
public class UpdateEventRequestValidation : AbstractValidator<UpdateEventRequest>
{
    public UpdateEventRequestValidation()
    {
        ClassLevelCascadeMode = CascadeMode.StopOnFirstFailure;

        this.ApplyCommonRules();
    }
}
