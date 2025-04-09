using BikeBuddy.API.Hubs;
using BikeBuddy.API.Shared.Extensions;
using BikeBuddy.Application.DtoModels.Chat;
using BikeBuddy.Application.Services.Chat.JoinChatService;
using BikeBuddy.Application.Services.Chat.LeaveChatService;
using BikeBuddy.Application.Services.Chat.SendMessageService;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace BikeBuddy.API.Controllers;

[Route("group-chats/")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
[ApiController]
public class ChatController(IHubContext<GroupChatHub, IGroupChatClient> _hubContext) : ControllerBase
{
    [HttpPost("{chatId:Guid}/join")]
    public async Task<ActionResult<bool>> JoinChat(
        [FromServices] IJoinChatService joinChatService,
        Guid chatId,
        CancellationToken cancellationToken)
    {
        var result = await joinChatService.ExecuteAsync(chatId, User, cancellationToken);

        return result.ToResponse();
    }

    [HttpPost("{chatId:Guid}/leave")]
    public async Task<ActionResult<bool>> LeaveChat(
        [FromServices] ILeaveChatService leaveChatService,
        Guid chatId,
        CancellationToken cancellationToken)
    {
        var result = await leaveChatService.ExecuteAsync(chatId, User, cancellationToken);

        return result.ToResponse();
    }

    [HttpPost("send")]
    public async Task<ActionResult<MessageDto>> SendMessage(
        [FromServices] ISendMessageService sendMessageService,
        [FromBody] SendMessageRequest request,
        CancellationToken cancellationToken)
    {
        var result = await sendMessageService.ExecuteAsync(request, cancellationToken);

        if (result.IsSuccess)
        {
            await _hubContext.Clients.Group(request.GroupChatId.ToString()).ReceiveMessage(result.Value);
        }
        else
        {
            await _hubContext.Clients.Users([request.UserId.ToString()]).Error(result.Error.Message);
        }

        return result.ToResponse();

    }
}
