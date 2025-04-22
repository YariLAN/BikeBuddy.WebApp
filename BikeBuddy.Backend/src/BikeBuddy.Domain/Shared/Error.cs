namespace BikeBuddy.Domain.Shared;


public record Error
{
    const string SEPARATOR = "||";

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

    public static Error Forbidden(string message)
    {
        return new Error(message, ErrorType.Forbidden);
    }

    public string Serialize()
    {
        return string.Join(SEPARATOR, Message, Type);
    }

    public static Error Deserialize(string serialized)
    {
        var parts = serialized.Split(SEPARATOR);

        if (parts.Length < 2)
        {
            throw new ArgumentException("Invalid serialized format");
        }

        if (Enum.TryParse<ErrorType>(parts[1], out var type) == false)
        {
            throw new ArgumentException("Invalid serialized format");
        }

        return new Error(parts[0], type);
    }
}

public enum ErrorType
{
    NotFound,
    Validation,
    Failure,
    Conflict,
    Unauthorized,
    Forbidden
}
