using BikeBuddy.Domain.Models.NotificationControl;
using BikeBuddy.Domain.Shared;
using BikeBuddy.Infrastructure.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BikeBuddy.Infrastructure.Configurations;

internal class NotificationConfiguration : IEntityTypeConfiguration<Notification>
{
    public void Configure(EntityTypeBuilder<Notification> builder)
    {
        builder.ToTable("notifications");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Title)
            .HasMaxLength(Constants.LOW_TEXT_LENGTH);

        builder.Property(x => x.Message)
            .HasMaxLength(Constants.HIGH_TEXT_LENGTH);

        builder.Property(x => x.Url)
            .HasMaxLength(Constants.HIGH_TEXT_LENGTH);

        builder.Property(x => x.Type)
            .HasConversion<string>();

        builder.ConfigureTimestamps();

        builder.HasOne(x => x.AuthUser)
            .WithMany(x => x.NotificationMessages)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
