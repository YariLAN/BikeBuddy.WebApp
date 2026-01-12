using System.Globalization;
using BikeBuddy.API.Hubs;
using BikeBuddy.Infrastructure;
using Hangfire;
using Microsoft.EntityFrameworkCore;

namespace BikeBuddy.API.Shared.Extensions;

internal static class WebApplicationExtensions
{
    public static WebApplication Configure(this WebApplication app)
    {
        app.ConfigureCulture();
        
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseCors("CorsPolicy");

        app.MapHubs();

        app.UseHttpsRedirection();
        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();
        app.UseHangfireDashboard("/hangfire");
        
        return app;
    }
    
    public static async Task MigrateDatabase(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        await db.Database.MigrateAsync();
    }

    private static void ConfigureCulture(this WebApplication app)
    {
        var cultureInfo = new CultureInfo("en-US");

        CultureInfo.DefaultThreadCurrentCulture = cultureInfo;
        CultureInfo.DefaultThreadCurrentUICulture = cultureInfo;
    }

    
    private static void MapHubs(this WebApplication app)
    {
        app.MapHub<GroupChatHub>("/hub/group-chat");
        app.MapHub<NotificationHub>("/hub/notifications");
    }
}