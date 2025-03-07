using BikeBuddy.Application.Services.Auth;
using BikeBuddy.Application.Services.Common;
using BikeBuddy.Application.Services.Event;
using BikeBuddy.Application.Services.Profile;
using BikeBuddy.Infrastructure.Options;
using BikeBuddy.Infrastructure.Repositories.Auth;
using BikeBuddy.Infrastructure.Repositories.Event;
using BikeBuddy.Infrastructure.Repositories.Profile;
using BikeBuddy.Infrastructure.Services.Auth;
using BikeBuddy.Infrastructure.Services.Auth.Google;
using BikeBuddy.Infrastructure.Services.Common;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Minio;

namespace BikeBuddy.Infrastructure;

public static class Inject
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<ApplicationDbContext>()
                .AddRepositories()
                .AddMinio(configuration);

        services.AddScoped<IPasswordHasher, PasswordHasher>();
        services.AddScoped<IJwtProvider, JwtProvider>();
        services.AddScoped<ICookieProvider, CookieProvider>();

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

            options.WithEndpoint(minioOptions.Endpoint);

            options.WithCredentials(minioOptions.AccessKey, minioOptions.SecretKey);
            options.WithSSL(minioOptions.WithSsl);
        });

        services.AddTransient<IFileProvider, MinioProvider>();

        return services;
    }

    private static IServiceCollection AddRepositories(this IServiceCollection services)
    {
        services.AddTransient<IAuthRepository, AuthRepository>();

        services.AddTransient<IRefreshTokensRepository, RefreshTokensRepository>();

        services.AddTransient<IUserProfileRepository, UserProfileRepository>();

        services.AddTransient<IEventRepository, EventRepository>();

        return services;
    }
}
