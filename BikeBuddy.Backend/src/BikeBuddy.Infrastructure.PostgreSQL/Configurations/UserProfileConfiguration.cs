using BikeBuddy.Domain.Models.ProfileControl;
using BikeBuddy.Domain.Shared;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BikeBuddy.Infrastructure.Configurations;

public class UserProfileConfiguration : IEntityTypeConfiguration<UserProfile>
{
    public void Configure(EntityTypeBuilder<UserProfile> builder)
    {
        builder.ToTable("user_profiles");

        builder.HasKey(u => u.Id);

        builder.Property(u => u.UserId)
            .IsRequired();

        builder.Property(u => u.Surname)
            .HasMaxLength(Constants.LOW_TEXT_LENGTH);  
        
        builder.Property(u => u.Name)
            .HasMaxLength(Constants.LOW_TEXT_LENGTH);    
        
        builder.Property(u => u.MiddleName)
            .HasMaxLength(Constants.LOW_TEXT_LENGTH)
            .IsRequired(false);   
        
        builder.Property(u => u.BirthDay)
            .IsRequired(false);

        builder.OwnsOne(up => up.Address, ad =>
        {
            ad.ToJson();

            ad.Property(ad => ad.Country)
                  .HasMaxLength(Constants.LOW_TEXT_LENGTH);

            ad.Property(ad => ad.City)
                  .HasMaxLength(Constants.LOW_TEXT_LENGTH);
        });

        builder.Property(u => u.PhotoUrl)
            .IsRequired(false);

        builder.HasOne(x => x.AuthUser)
            .WithOne(x => x.UserProfile)
            .HasForeignKey<UserProfile>(x => x.UserId);
    }
}
