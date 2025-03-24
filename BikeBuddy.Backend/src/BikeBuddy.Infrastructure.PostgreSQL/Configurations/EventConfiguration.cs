using BikeBuddy.Domain.Models.EventControl;
using BikeBuddy.Domain.Shared;
using BikeBuddy.Infrastructure.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BikeBuddy.Infrastructure.Configurations;

public class EventConfiguration : IEntityTypeConfiguration<Event>
{
    public void Configure(EntityTypeBuilder<Event> builder)
    {
        builder.ToTable("events");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Name)
            .HasMaxLength(Constants.LOW_TEXT_LENGTH);

        builder.Property(e => e.Description)
            .HasMaxLength(Constants.HIGH_TEXT_LENGTH);

        builder.Property(e => e.Type).HasConversion<string>();

        builder.Property(e => e.BicycleType)
            .HasColumnName("bicycle_type")
            .HasConversion<string>();

        builder.Property(e => e.StartAddress)
            .HasMaxLength(Constants.LOW_TEXT_LENGTH + 100);

        builder.Property(e => e.EndAddress)
            .HasMaxLength(Constants.LOW_TEXT_LENGTH + 100);

        builder.OwnsOne(x => x.Details, e =>
        {
            e.ToJson();
            e.OwnsMany(r => r.Routes, r =>
            {
                r.Property(r => r.OrderId).IsRequired();

                r.Property(r => r.Address).HasMaxLength(Constants.HIGH_TEXT_LENGTH);

                r.OwnsOne(p => p.Point, p =>
                {
                   p.Property(p => p.Lat).HasMaxLength(Constants.MIDDLE_LOW_TEXT_LENGTH);

                   p.Property(p => p.Lon).HasMaxLength(Constants.MIDDLE_LOW_TEXT_LENGTH);
                });
            });
        });

        builder.Property(e => e.Status).HasConversion<string>();

        builder.ConfigureTimestamps();

        builder.HasOne(e => e.User)
               .WithMany(u => u.Events)
               .HasForeignKey(e => e.CreatedBy)
               .OnDelete(DeleteBehavior.SetNull);
    }
}
