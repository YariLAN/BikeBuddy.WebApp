using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using BikeBuddy.Domain.Models.AuthControl;
using BikeBuddy.Domain.Shared;

namespace BikeBuddy.Infrastructure.Configurations;

public class AuthUserConfiguration : IEntityTypeConfiguration<AuthUser>
{
    public void Configure(EntityTypeBuilder<AuthUser> builder)
    {
        builder.ToTable("auth_users");

        builder.HasKey(au => au.Id);

        builder.Property(au => au.UserName)
            .HasMaxLength(Constants.MIN_LOW_TEXT_LENGTH);

        builder.Property(au => au.Email)
            .HasMaxLength(Constants.LOW_TEXT_LENGTH);

        builder.Property(au => au.IsVerified)
            .HasDefaultValue(false);

        builder.Property(au => au.LastLoginAt)
            .IsRequired(false);

        builder.HasOne(x => x.UserProfile)
            .WithOne()
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(x => x.RefreshTokens)
            .WithOne(x => x.AuthUser)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
