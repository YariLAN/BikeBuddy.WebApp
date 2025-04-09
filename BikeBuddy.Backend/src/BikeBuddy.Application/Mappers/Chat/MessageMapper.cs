using BikeBuddy.Application.DtoModels.Chat;
using BikeBuddy.Domain.Models.AuthControl;
using BikeBuddy.Domain.Models.ChatControl.Entities;

namespace BikeBuddy.Application.Mappers.Chat
{
    public class MessageMapper
    {
        public static Message ToMap(SendMessageRequest request)
        {
            return Message.Create(
                Guid.NewGuid(),
                request.GroupChatId,
                request.UserId,
                request.Content);
        }

        public static MessageDto ToMap(Message message, AuthUser? authUser = null)
        {
            return new(
                message.Id, 
                message.GroupChatId,
                message.UserId, 
                authUser?.UserName ?? "Unknown", 
                message.Content, 
                message.CreatedAt);
        }
    }
}
