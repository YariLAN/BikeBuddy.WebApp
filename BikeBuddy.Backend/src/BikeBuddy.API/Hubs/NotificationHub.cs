﻿using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace BikeBuddy.API.Hubs;

[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class NotificationHub : Hub
{
    public async Task ConnectedAsync()
    {
        if (Guid.TryParse(Context.UserIdentifier, out var userId))
        {
            var groupName = userId.ToString();
            var connectionAlreadyInGroup = Context.Items.ContainsKey($"AddedToGroup_{groupName}");

            if (!connectionAlreadyInGroup)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, userId.ToString());
                Context.Items[$"AddedToGroup_{groupName}"] = true;
            }
        }
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        if (Guid.TryParse(Context.UserIdentifier, out var userId))
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, userId.ToString());
        }

        await base.OnDisconnectedAsync(exception);
    }
}
