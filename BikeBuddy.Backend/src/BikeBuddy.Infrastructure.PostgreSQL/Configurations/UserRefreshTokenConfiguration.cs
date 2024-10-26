using BikeBuddy.Domain.Models;
using BikeBuddy.Domain.Models.AuthControl;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BikeBuddy.Infrastructure.Configurations;

public class UserRefreshTokenConfiguration : IEntityTypeConfiguration<UserRefreshToken>
{
    public void Configure(EntityTypeBuilder<UserRefreshToken> builder)
    {
        builder.ToTable("user_refresh_tokens");

        builder.HasKey(rt => rt.Id);

        builder.HasOne(x => x.AuthUser)
            .WithOne(x => x.RefreshToken)
            .HasForeignKey<UserRefreshToken>(x => x.UserId);
    }
}
