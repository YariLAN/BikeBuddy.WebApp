using BikeBuddy.API.Hubs;
using BikeBuddy.API.Shared.Extensions;
using BikeBuddy.Application;
using BikeBuddy.Infrastructure;
using SharpGrip.FluentValidation.AutoValidation.Mvc.Extensions;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddCustomSwaggerGen();

builder.Services.AddAuthentication(builder.Configuration);

builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddApplication(builder.Configuration);

builder.Services.AddFluentValidationAutoValidation(configuration =>
{
    configuration.OverrideDefaultResultFactoryWith<CustomValidationResultFactory>();
});

builder.Services.AddCors("CorsPolicy");

builder.Services.AddSignalR(opt =>
{
    opt.ClientTimeoutInterval = TimeSpan.FromSeconds(10);
    opt.KeepAliveInterval = TimeSpan.FromSeconds(5);
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("CorsPolicy");


app.MapHub<GroupChatHub>("/hub/group-chat");

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
