using BikeBuddy.Domain.Models.ChatControl.Entities;
using BikeBuddy.Domain.Models.ChatControl.ValueObjects;
using BikeBuddy.Domain.Models.EventControl;
using BikeBuddy.Domain.Shared;

namespace BikeBuddy.Domain.Models.ChatControl;

public class GroupChat : ICreatedUpdateAt
{
    public Guid Id { get; private set; }

    public string Name { get; private set; } = string.Empty;

    public string Description { get; private set; } = string.Empty;

    public Guid? EventId { get; private set; }

    public DateTime? LastMessageAt { get; private set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public Event? Event { get; private set; }

    public List<MemberGroupChat> Members { get; private set; } = [];

    public List<Message> Messages { get; private set; } = [];

    public GroupChat() { }

    private GroupChat(Guid id, string name, string description, Guid eventId)
    {
        Id = id;
        Name = name;
        Description = description;
        EventId = eventId;
    }

    public static GroupChat Create(Guid id, string name, string description, Guid eventId, Guid authorId)
    {
        var chat = new GroupChat(id, name, description, eventId);

        chat.AddMember(authorId, Role.AUTHOR);

        return chat;
    }

    public void UpdateLastMessageAt()
    {
        LastMessageAt = DateTimeUtils.ToUTC(DateTime.Now);
    }

    public void AddMember(Guid userId, Role role)
    {
        Members.Add(MemberGroupChat.Create(Id, userId, role));
    }
}
