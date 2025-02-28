namespace BikeBuddy.Domain.Shared;

public static class DateTimeUtils
{
    public static DateTime ToUnspecified(this DateTime dateTime)
    {
        return DateTime.SpecifyKind(dateTime, DateTimeKind.Unspecified);
    }      

    public static DateTime ToUTC(this DateTime dateTime)
    {
        return DateTime.SpecifyKind(dateTime, DateTimeKind.Utc);
    }

    public static DateTime NowToUTC()
    {
        return DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);
    }
}
