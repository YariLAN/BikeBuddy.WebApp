using BikeBuddy.Domain.Models.ChatControl;
using BikeBuddy.Domain.Models.ChatControl.Entities;
using BikeBuddy.Domain.Shared;
using BikeBuddy.Infrastructure.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BikeBuddy.Infrastructure.Configurations;

public class ChatConfiguration : IEntityTypeConfiguration<GroupChat>
{
    public void Configure(EntityTypeBuilder<GroupChat> builder)
    {
        builder.ToTable("group_chats");

        builder.HasKey(e => e.Id);

        builder.Property(c => c.Name)
            .HasMaxLength(Constants.LOW_TEXT_LENGTH);

        builder.Property(e => e.Description)
            .HasMaxLength(Constants.HIGH_TEXT_LENGTH);

        builder.Property(u => u.LastMessageAt)
            .HasColumnType("timestamp with time zone")
            .IsRequired(false);

        builder.ConfigureTimestamps();

        builder.HasOne(c => c.Event)
            .WithOne(e => e.Chat);
    }
}

public class MemberChatConfiguration : IEntityTypeConfiguration<MemberGroupChat>
{
    public void Configure(EntityTypeBuilder<MemberGroupChat> builder)
    {
        builder.ToTable("members_group_chats");

        builder.HasKey(mc => new { mc.GroupChatId, mc.UserId });

        builder.Property(e => e.Role)
            .HasConversion<string>();

        builder.HasOne(mc => mc.Chat)
            .WithMany(c => c.Members)
            .HasForeignKey(mc => mc.GroupChatId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(mc => mc.AuthUser)
            .WithMany(au => au.Membership)
            .HasForeignKey(mc => mc.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.ConfigureTimestamps();
    }
}

public class MessageConfiguration : IEntityTypeConfiguration<Message>
{
    public void Configure(EntityTypeBuilder<Message> builder)
    {
        builder.ToTable("messages");

        builder.HasKey(m => m.Id);

        builder.Property(m => m.Content)
            .HasMaxLength(5000);

        builder.HasOne(m => m.Chat)
            .WithMany(c => c.Messages)
            .HasForeignKey(m => m.GroupChatId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(m => m.AuthUser)
            .WithMany(au => au.Messages)
            .HasForeignKey(m => m.UserId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.ConfigureTimestamps();
    }
}
