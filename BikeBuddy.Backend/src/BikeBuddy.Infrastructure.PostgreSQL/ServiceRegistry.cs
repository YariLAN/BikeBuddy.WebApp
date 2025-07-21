using BikeBuddy.Application.Services.Auth;
using BikeBuddy.Application.Services.Chat;
using BikeBuddy.Application.Services.Common;
using BikeBuddy.Application.Services.Common.Notification;
using BikeBuddy.Application.Services.Event;
using BikeBuddy.Application.Services.Profile;
using BikeBuddy.Application.Services.Scheduler.Event;
using BikeBuddy.Infrastructure.Options;
using BikeBuddy.Infrastructure.Repositories.Auth;
using BikeBuddy.Infrastructure.Repositories.Chat;
using BikeBuddy.Infrastructure.Repositories.Event;
using BikeBuddy.Infrastructure.Repositories.Notification;
using BikeBuddy.Infrastructure.Repositories.Profile;
using BikeBuddy.Infrastructure.Services.Auth;
using BikeBuddy.Infrastructure.Services.Auth.Google;
using BikeBuddy.Infrastructure.Services.Common;
using BikeBuddy.Infrastructure.Services.Scheduler.Event;
using Hangfire;
using Hangfire.PostgreSql;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Minio;

namespace BikeBuddy.Infrastructure;

public static class ServiceRegistry
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<ApplicationDbContext>()
                .AddRepositories()
                .AddMinio(configuration)
                .AddHangfire(configuration);

        services.AddScoped<IPasswordHasher, PasswordHasher>();
        services.AddScoped<IJwtProvider, JwtProvider>();
        services.AddScoped<ICookieProvider, CookieProvider>();

        services.AddScoped<IEventJobSchedulerService, EventJobSchedulerService>();

        services.AddTransient<IGoogleService, GoogleService>();

        return services;
    }

    private static IServiceCollection AddMinio(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<MinioOptions>(configuration.GetSection(MinioOptions.MINIO));

        services.AddMinio(options =>
        {
            var minioOptions = configuration.GetSection(MinioOptions.MINIO).Get<MinioOptions>()
                               ?? throw new ApplicationException("Missing minio configuration");

            options.WithEndpoint(minioOptions.Endpoint)
                   .WithCredentials(minioOptions.AccessKey, minioOptions.SecretKey)
                   .WithSSL(minioOptions.WithSsl)
                   .Build();
        });

        services.AddTransient<IFileProvider, MinioProvider>();

        return services;
    }

    private static IServiceCollection AddHangfire(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddHangfire(h =>
        {
            h.UsePostgreSqlStorage(opt => opt.UseNpgsqlConnection(configuration.GetConnectionString("HangfireDb")));
        });

        services.AddHangfireServer();

        return services;
    }

    private static IServiceCollection AddRepositories(this IServiceCollection services)
    {
        services.AddTransient<IAuthRepository, AuthRepository>();

        services.AddTransient<IRefreshTokensRepository, RefreshTokensRepository>();

        services.AddTransient<IUserProfileRepository, UserProfileRepository>();

        services.AddTransient<IEventRepository, EventRepository>();

        services.AddTransient<IChatRepository, ChatRepository>();

        services.AddTransient<IMessageRepository, MessageRepository>();

        services.AddScoped<INotificationRepository, NotificationRepository>();

        return services;
    }
}
