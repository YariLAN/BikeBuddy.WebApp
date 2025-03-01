﻿using static System.Runtime.InteropServices.JavaScript.JSType;

namespace BikeBuddy.Domain.Shared;

public class Errors
{
    public static class General
    {
        public static Error ValueIsInvalid(string? name = null)
        {
            var forName = name ?? "Value";

            return Error.Validation($"'{forName}' is invalid");
        }

        public static Error ValueIsEmpty(string? name = null)
        {
            var forName = name ?? "Value";

            return Error.Validation($"{name} can not be empty.");
        }

        public static Error NotFound(Guid? id = null)
        {
            string forId = id is null
                ? ""
                : $" by id = {id}";

            return Error.NotFound($"Record not found{forId}");
        }

        public static Error ValueIsInvalidLength(string? name = null)
        {
            string forName = name is null
                ? " "
                : " " + name + " ";

            return Error.Validation($"Invalid{forName}length");
        }

        public static Error AlreadyExist(string name = "")
        {
            return Error.Validation($"Value {name} already exist");
        }
    }

    public static class Event
    {
        public static Error DateRangeIsInvalid(string name)
        {
            string message = name switch
            {
                "StartDate" => "The start date cannot be later than the end date.",
                "EndDate" => "The end date cannot be earlier than the start date.",
                _ => "The date range is invalid."
            };

            return Error.Validation(message);
        }
    }
}
