namespace BikeBuddy.Domain.Shared;


public record Error
{
    public string Message { get; }

    public ErrorType Type { get; }

    private Error(string msg, ErrorType type)
    {
        Message = msg;
        Type = type;
    }

    public static Error Validation(string message)
    {
        return new Error(message, ErrorType.Validation);
    }

    public static Error NotFound(string message)
    {
        return new Error(message, ErrorType.NotFound);
    }

    public static Error Failure(string message)
    {
        return new Error(message, ErrorType.Failure);
    }         
    
    public static Error Conflict(string message)
    {
        return new Error(message, ErrorType.Conflict);
    }  
    
    public static Error UnAuthorized(string message)
    {
        return new Error(message, ErrorType.Unauthorized);
    }
}

public enum ErrorType
{
    NotFound,
    Validation,
    Failure,
    Conflict,
    Unauthorized,
}
