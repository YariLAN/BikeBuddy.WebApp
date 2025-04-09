using BikeBuddy.Application.DtoModels.Chat;
using BikeBuddy.Application.Services.Chat.GetChatMessagesService;
using BikeBuddy.Application.Services.Chat.SendMessageService;
using BikeBuddy.Application.Services.Chat.StateManagerService;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace BikeBuddy.API.Hubs;

public interface IGroupChatClient
{
    Task ReceiveMessage(MessageDto message);

    Task Error(string message);   

    Task UserJoined(Guid userId); 

    Task UserLeft(Guid userId);

    Task Joined(Guid groupChatId);

    Task Left(Guid groupChatId);

    Task ActiveUsersList(List<Guid> activeUsers);

    Task LoadMessages(List<MessageDto> messages);
}

[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class GroupChatHub(
    ISendMessageService sendMessageService,
    IStateManagerService stateManagerService,
    IGetChatMessagesService getChatMessagesService) : Hub<IGroupChatClient>
{
    public async Task SendMessages(SendMessageRequest request)
    {
        var result = await sendMessageService.ExecuteAsync(request, CancellationToken.None);

        if (result.IsSuccess)
            await Clients.Group(request.GroupChatId.ToString()).ReceiveMessage(result.Value);
        else
            await Clients.Caller.Error(result.Error.Message);
    }

    public async Task JoinChat(Guid groupChatId)
    {
        var userId = !string.IsNullOrEmpty(Context.UserIdentifier) 
            ? Guid.Parse(Context.UserIdentifier) 
            : Guid.Empty;

        var result = await stateManagerService.JoinChatAsync(groupChatId, userId, Context.ConnectionId);
        
        if (result.IsSuccess)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupChatId.ToString());
            await Clients.Group(groupChatId.ToString()).UserJoined(userId);
            await Clients.Caller.Joined(groupChatId);
        }
        else
        {
            await Clients.Caller.Error(result.Error.Message);
        }
    }

    public async Task LoadMessages(Guid groupChatId)
    {
        var userId = !string.IsNullOrEmpty(Context.UserIdentifier)
            ? Guid.Parse(Context.UserIdentifier)
            : Guid.Empty;

        var result = await getChatMessagesService.ExecuteAsync(groupChatId, userId, CancellationToken.None);

        if (result.IsSuccess)
            await Clients.Caller.LoadMessages(result.Value);
        else
            await Clients.Caller.Error(result.Error.Message);
    }

    public async Task LeaveChat(Guid groupChatId)
    {
        var userId = !string.IsNullOrEmpty(Context.UserIdentifier)
            ? Guid.Parse(Context.UserIdentifier)
            : Guid.Empty;

        var result = await stateManagerService.LeaveChatAsync(groupChatId, userId, Context.ConnectionId);

        if (result.IsSuccess)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupChatId.ToString());
            await Clients.Group(groupChatId.ToString()).UserLeft(userId);
            await Clients.Caller.Left(groupChatId);
        }
        else
        {
            await Clients.Caller.Error(result.Error.Message);
        }
    }

    public async Task GetActiveUsers(Guid groupChatId)
    {
        var users = await stateManagerService.GetActiveUsersAsync(groupChatId);
        await Clients.Caller.ActiveUsersList(users);
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await stateManagerService.HandleDisconnectAsync(Context.ConnectionId);
        await base.OnDisconnectedAsync(exception);
    }
}