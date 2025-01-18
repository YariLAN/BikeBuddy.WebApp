using BikeBuddy.Application.Services.Common;
using Microsoft.AspNetCore.Http;

namespace BikeBuddy.Infrastructure.Services.Common
{
    public class CookieProvider : ICookieProvider
    {
        public CookieOptions CreateCookieOptions(DateTimeOffset dateTimeOffset)
        {
            return new()
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = dateTimeOffset,
            };
        }
    }
}
