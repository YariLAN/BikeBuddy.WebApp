using BikeBuddy.Application.Options;
using BikeBuddy.Application.Services.Auth.Login;
using BikeBuddy.Application.Services.Auth.Logout;
using BikeBuddy.Application.Services.Auth.Refresh;
using BikeBuddy.Application.Services.Auth.Register;
using BikeBuddy.Application.Services.Profile.CreateProfileService;
using BikeBuddy.Application.Services.Profile.GetProfileService;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace BikeBuddy.Application;

public static class Inject
{
    public static IServiceCollection AddApplication(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<JwtOptions>(configuration.GetSection(nameof(JwtOptions)));

        services.AddOptions<JwtBearerOptions>()
            .Configure<IConfiguration>((options, configuration) =>
            {
                var jwtOptions = configuration.GetSection(nameof(JwtOptions)).Get<JwtOptions>();

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions!.SecretKey))
                };
            });

        // Auth
        services.AddTransient<IRegisterService, RegisterService>();
        services.AddTransient<ILoginService, LoginService>();
        services.AddTransient<IRefreshService, RefreshService>();
        services.AddTransient<ILogoutService, LogoutService>();

        // Profile
        services.AddTransient<IGetProfileService, GetProfileService>();
        services.AddTransient<ICreateProfileService, CreateProfileService>();

        return services;
    }
}
