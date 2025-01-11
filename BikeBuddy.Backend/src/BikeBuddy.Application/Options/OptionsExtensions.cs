using Microsoft.AspNetCore.Http;

namespace BikeBuddy.Application.Options
{
    public class OptionsExtensions
    {
        public static CookieOptions CookieOptions = new()
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
        };
    }
}
