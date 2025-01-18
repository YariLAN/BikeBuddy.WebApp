using BikeBuddy.Application.Services.Auth;
using BikeBuddy.Application.Services.Common;

using BikeBuddy.Infrastructure.Repositories.Auth;
using BikeBuddy.Infrastructure.Services.Auth;
using BikeBuddy.Infrastructure.Services.Auth.Google;
using BikeBuddy.Infrastructure.Services.Common;

using Microsoft.Extensions.DependencyInjection;

namespace BikeBuddy.Infrastructure;

public static class Inject
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddScoped<ApplicationDbContext>();

        services.AddTransient<IAuthRepository, AuthRepository>();
        services.AddTransient<IRefreshTokensRepository, RefreshTokensRepository>();

        services.AddScoped<IPasswordHasher, PasswordHasher>();
        services.AddScoped<IJwtProvider, JwtProvider>();
        services.AddScoped<ICookieProvider, CookieProvider>();

        services.AddTransient<IGoogleService, GoogleService>();


        return services;
    }
}
