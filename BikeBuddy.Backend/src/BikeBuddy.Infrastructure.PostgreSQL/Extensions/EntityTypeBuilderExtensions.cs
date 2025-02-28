using BikeBuddy.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BikeBuddy.Infrastructure.Extensions;

public static class EntityTypeBuilderExtensions
{
    public static void ConfigureTimestamps<TEntity>(this EntityTypeBuilder<TEntity> builder)
        where TEntity : class
    {
        if (typeof(ICreatedUpdateAt).IsAssignableFrom(typeof(TEntity)))
        {
            builder.Property(nameof(ICreatedUpdateAt.CreatedAt))
               .HasColumnName("created_at")
               .HasDefaultValueSql("CURRENT_TIMESTAMP");

            builder.Property(nameof(ICreatedUpdateAt.UpdatedAt))
               .HasColumnName("updated_at")
               .HasDefaultValueSql("CURRENT_TIMESTAMP")
               .ValueGeneratedOnUpdate();
        }
    }
}