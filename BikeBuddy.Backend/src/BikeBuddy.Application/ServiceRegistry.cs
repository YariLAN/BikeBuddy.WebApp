using BikeBuddy.Application.Jobs.Executor.Event;
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
using BikeBuddy.Application.Services.Common.Notification;
using BikeBuddy.Application.Services.Event.CancelEventService;
using BikeBuddy.Application.Services.Event.ConfirmEventService;
using BikeBuddy.Application.Services.Event.CreateEventService;
using BikeBuddy.Application.Services.Event.GetEventService;
using BikeBuddy.Application.Services.Event.GetEventsService;
using BikeBuddy.Application.Services.Event.UpdateEventService;
using BikeBuddy.Application.Services.Event.UploadMapService;
using BikeBuddy.Application.Services.Profile.CreateProfileService;
using BikeBuddy.Application.Services.Profile.GetProfileService;
using BikeBuddy.Application.Services.Profile.UpdateProfileService;
using BikeBuddy.Application.Services.Profile.UploadAvatarService;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using BikeBuddy.Application.Services.Auth.Verify;

namespace BikeBuddy.Application;

public static class ServiceRegistry
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
        services.AddAuth()
                .AddProfile()
                .AddEvent()
                .AddChat()
                .AddNotification()
                .AddJobs();
        
        services.AddValidatorsFromAssembly(typeof(ServiceRegistry).Assembly);

        return services;
    }

    private static IServiceCollection AddAuth(this IServiceCollection services)
    {
        services.AddScoped<IRegisterService, RegisterService>();
        services.AddScoped<ILoginService, LoginService>();
        services.AddScoped<IRefreshService, RefreshService>();
        services.AddScoped<ILogoutService, LogoutService>();
        
        services.AddScoped<IEmailVerificationService, EmailVerificationService>();

        return services;
    }
    
    private static IServiceCollection AddProfile(this IServiceCollection services)
    {
        services.AddScoped<IGetProfileService, GetProfileService>();
        services.AddScoped<ICreateProfileService, CreateProfileService>();
        services.AddScoped<IUpdateProfileService, UpdateProfileService>();
        services.AddScoped<IUploadAvatarService, UploadAvatarService>();
        return services;
    }    
    
    private static IServiceCollection AddEvent(this IServiceCollection services)
    {
        services.AddScoped<ICreateEventService, CreateEventService>();
        services.AddScoped<IGetEventsService, GetEventsService>();
        services.AddScoped<IGetEventService, GetEventService>();
        services.AddScoped<IUploadMapService, UploadMapService>();
        services.AddScoped<ICancelEventService, CancelEventService>();
        services.AddScoped<IUpdateEventService, UpdateEventService>();
        services.AddScoped<IConfirmEventService, ConfirmEventService>();
        return services;
    }
    
    private static IServiceCollection AddChat(this IServiceCollection services)
    {
        services.AddScoped<IJoinChatService, JoinChatService>();
        services.AddScoped<ILeaveChatService, LeaveChatService>();
        services.AddScoped<ISendMessageService, SendMessageService>();
        services.AddScoped<IGetChatMessagesService, GetChatMessagesService>();
        
        services.AddScoped<IStateManagerService, StateManagerService>();
        return services;
    }
    
    private static IServiceCollection AddNotification(this IServiceCollection services)
    {
        services.AddScoped<INotificationService, NotificationService>();
        return services;
    }
    
    private static IServiceCollection AddJobs(this IServiceCollection services)
    {
        services.AddScoped<IEventJobExecutor,  EventJobExecutor>();

        return services;
    }
}
