using BikeBuddy.Application.Options;
using BikeBuddy.Application.Services.Auth.Login;
using BikeBuddy.Application.Services.Auth.Logout;
using BikeBuddy.Application.Services.Auth.Refresh;
using BikeBuddy.Application.Services.Auth.Register;
using BikeBuddy.Application.Services.Chat.GetChatMessagesService;
using BikeBuddy.Application.Services.Chat.JoinChatService;
using BikeBuddy.Application.Services.Chat.LeaveChatService;
using BikeBuddy.Application.Services.Chat.SendMessageService;
using BikeBuddy.Application.Services.Chat.StateManagerService;
using BikeBuddy.Application.Services.Event.CancelEventService;
using BikeBuddy.Application.Services.Event.CreateEventService;
using BikeBuddy.Application.Services.Event.GetEventService;
using BikeBuddy.Application.Services.Event.GetEventsService;
using BikeBuddy.Application.Services.Event.UploadMapService;
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

        services.AddServices();

        return services;
    }

    public static IServiceCollection AddServices(this IServiceCollection services)
    {
        // Auth
        services.AddScoped<IRegisterService, RegisterService>();
        services.AddScoped<ILoginService, LoginService>();
        services.AddScoped<IRefreshService, RefreshService>();
        services.AddScoped<ILogoutService, LogoutService>();

        // Profile
        services.AddScoped<IGetProfileService, GetProfileService>();
        services.AddScoped<ICreateProfileService, CreateProfileService>();
        services.AddScoped<IUpdateProfileService, UpdateProfileService>();

        // Event
        services.AddScoped<ICreateEventService, CreateEventService>();
        services.AddScoped<IGetEventsService, GetEventsService>();
        services.AddScoped<IGetEventService, GetEventService>();
        services.AddScoped<IUploadMapService, UploadMapService>();
        services.AddScoped<ICancelEventService, CancelEventService>();

        // Chat
        services.AddScoped<IJoinChatService, JoinChatService>();
        services.AddScoped<ILeaveChatService, LeaveChatService>();
        services.AddScoped<ISendMessageService, SendMessageService>();
        services.AddScoped<IGetChatMessagesService, GetChatMessagesService>();

        // ChatManager
        services.AddScoped<IStateManagerService, StateManagerService>();

        services.AddValidatorsFromAssembly(typeof(Inject).Assembly);

        return services;
    }
}
