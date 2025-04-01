
using BikeBuddy.Domain.Models.AuthControl;

namespace BikeBuddy.Domain.Models.ChatControl.Entities;

public class Message : ICreatedUpdateAt
{
    public Guid Id { get; private set; }

    public Guid GroupChatId { get; private set; }

    public Guid? UserId { get; private set; }

    public string Content { get; private set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public GroupChat Chat { get; private set; } = default!;

    public AuthUser? AuthUser { get; private set; }

    public Message() { }    

    private Message(Guid id, Guid groupChatId, Guid userId, string content)
    {
        Id = id;
        GroupChatId = groupChatId;
        UserId = userId;
        Content = content;
    }

    public static Message Create(Guid id, Guid groupChatId, Guid userId, string content)
    {
        return new Message(id, groupChatId, userId, content);
    }
}
