using BikeBuddy.Application.Options;
using BikeBuddy.Application.Services.Auth.Login;
using BikeBuddy.Application.Services.Auth.Logout;
using BikeBuddy.Application.Services.Auth.Refresh;
using BikeBuddy.Application.Services.Auth.Register;
using BikeBuddy.Application.Services.Event.CreateEventService;
using BikeBuddy.Application.Services.Event.GetEventService;
using BikeBuddy.Application.Services.Event.GetEventsService;
using BikeBuddy.Application.Services.Profile.CreateProfileService;
using BikeBuddy.Application.Services.Profile.GetProfileService;
using BikeBuddy.Application.Services.Profile.UpdateProfileService;
using FluentValidation;
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
        services.AddTransient<IUpdateProfileService, UpdateProfileService>();

        // Event
        services.AddTransient<ICreateEventService, CreateEventService>();
        services.AddTransient<IGetEventsService, GetEventsService>();
        services.AddTransient<IGetEventService, GetEventService>();

        services.AddValidatorsFromAssembly(typeof(Inject).Assembly);

        return services;
    }
}
