using BikeBuddy.Domain.Models.AuthControl;
using BikeBuddy.Domain.Models.ChatControl;
using BikeBuddy.Domain.Models.EventControl;
using BikeBuddy.Domain.Models.ProfileControl;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace BikeBuddy.Infrastructure;

public class ApplicationDbContext : DbContext
{
    private readonly IConfiguration _configuration;

    private const string DATABASE = "BikeBuddyDb";

    public DbSet<AuthUser> Users { get; set; }

    public DbSet<UserProfile> Profiles { get; set; }

    public DbSet<UserRefreshToken> RefreshTokens { get; set; }

    public DbSet<Event> Events { get; set; }

    public DbSet<GroupChat> Chats { get; set; }

    public ApplicationDbContext(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public ApplicationDbContext() { }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql(_configuration.GetConnectionString(DATABASE));

        optionsBuilder.UseSnakeCaseNamingConvention();

        optionsBuilder.UseLoggerFactory(CreateLoggerFactory());
    }

    private ILoggerFactory CreateLoggerFactory() => LoggerFactory.Create(builder => { builder.AddConsole(); });

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }
}
