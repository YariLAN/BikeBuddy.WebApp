using Microsoft.AspNetCore.Http;

namespace BikeBuddy.Application.Services.Common
{
    public interface ICookieProvider
    {
        CookieOptions CreateCookieOptions(DateTimeOffset dateTimeOffset);
    }
}
