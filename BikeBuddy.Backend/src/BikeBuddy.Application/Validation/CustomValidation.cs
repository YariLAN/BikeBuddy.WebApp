using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;
using FluentValidation;

namespace BikeBuddy.Application.Validation;

public static class CustomValidation
{
    public static IRuleBuilderOptionsConditions<T, TElement> MustBeValueObject<T, TElement, TValueObject>(
        this IRuleBuilder<T, TElement> ruleBuilder,
        Func<TElement, Result<TValueObject, Error>> createValueObjectFunc)
    {
        return ruleBuilder.Custom((item, context) =>
        {
            Result<TValueObject, Error> result = createValueObjectFunc(item);

            if (result.IsSuccess)
                return;

            context.AddFailure(result.Error.Serialize());
        });
    }

    public static IRuleBuilderOptions<T, TProperty> WithError<T, TProperty>(
        this IRuleBuilderOptions<T, TProperty> rule, Error error)
    {
        return rule.WithMessage(error.Serialize());
    }
}
