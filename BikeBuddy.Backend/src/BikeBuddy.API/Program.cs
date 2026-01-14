using BikeBuddy.API.Services;
using BikeBuddy.API.Shared.Extensions;
using BikeBuddy.Application;
using BikeBuddy.Application.Services.Auth.Register;
using BikeBuddy.Application.Services.Common;
using BikeBuddy.Domain.Models.AuthControl;
using BikeBuddy.Infrastructure;
using BikeBuddy.Infrastructure.Services.Auth.Google;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SharpGrip.FluentValidation.AutoValidation.Mvc.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddCustomSwaggerGen();

builder.Services.AddAuthentication(builder.Configuration);

builder.Services.AddScoped<IRealTimeNotifier, RealTimeNotifier>();

builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddApplication(builder.Configuration);

builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.SuppressModelStateInvalidFilter = true;
});

builder.Services.AddFluentValidationAutoValidation(configuration =>
{
    configuration.EnableFormBindingSourceAutomaticValidation = true;
    configuration.EnableCustomBindingSourceAutomaticValidation = true;
});

builder.Services.AddCors("CorsPolicy");

builder.Services.AddSignalR(opt =>
{
    opt.ClientTimeoutInterval = TimeSpan.FromSeconds(10);
    opt.KeepAliveInterval = TimeSpan.FromSeconds(5);
});

//builder.WebHost.UseUrls("https://26.79.163.106:3002");

var app = builder.Build();

app.Configure();

await app.MigrateDatabase();

app.MapPost("/api/account/login/google", ( [FromQuery] string returnUrl, LinkGenerator linkGenerator,
    SignInManager<AuthUser> signInManager, HttpContext context) =>
{
    var properties = signInManager.ConfigureExternalAuthenticationProperties("Google",
        linkGenerator.GetPathByName(context, "GoogleAuthCallback") 
        + $"?returnUrl={returnUrl}");

    return Results.Challenge(properties, ["Google"]);
});

app.MapGet("/api/account/login/google/callback", async ([FromQuery] string returnUrl, 
    HttpContext context, IGoogleService googleService) =>
{
    var result = await context.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);

    if (!result.Succeeded)
    {
        return Results.Unauthorized();
    }

    await googleService.Login(result.Principal, context, CancellationToken.None);

    return Results.Redirect(returnUrl);
}).WithName("GoogleAuthCallback");

app.Run();
