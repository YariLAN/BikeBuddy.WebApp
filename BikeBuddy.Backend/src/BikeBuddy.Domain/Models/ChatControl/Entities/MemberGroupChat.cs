using BikeBuddy.Domain.Models.AuthControl;
using BikeBuddy.Domain.Models.ChatControl.ValueObjects;

namespace BikeBuddy.Domain.Models.ChatControl.Entities;

public class MemberGroupChat : ICreatedUpdateAt
{
    public Guid GroupChatId { get; private set; }

    public Guid UserId { get; private set; }

    public Role Role { get; private set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public GroupChat Chat { get; private set; } = default!;

    public AuthUser AuthUser { get; private set; } = default!;

    public MemberGroupChat() { }

    private MemberGroupChat(Guid groupChatId, Guid userId, Role role)
    {
        GroupChatId = groupChatId;
        UserId = userId;
        Role = role;
    }

    public static MemberGroupChat Create(Guid groupChatId, Guid userId, Role role)
    {
        return new MemberGroupChat(groupChatId, userId, role);
    }
}
