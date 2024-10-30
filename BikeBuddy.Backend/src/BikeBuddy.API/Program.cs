using BikeBuddy.API.Shared.Extensions;
using BikeBuddy.Application;
using BikeBuddy.Infrastructure;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddCustomSwaggerGen();

builder.Services.AddAuthentication(builder.Configuration);

builder.Services.AddInfrastructure();
builder.Services.AddApplication(builder.Configuration);

builder.Services.AddCors("CorsPolicy");

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("CorsPolicy");

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
