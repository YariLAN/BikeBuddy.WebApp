using BikeBuddy.API.Shared.Extensions;
using BikeBuddy.Application.DtoModels.Common;
using BikeBuddy.Application.DtoModels.Notification;
using BikeBuddy.Application.Services.Common.Notification;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BikeBuddy.API.Controllers;

[Route("notifications/")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
[ApiController]
public class NotificationUserController : ControllerBase
{
    /// <returns>
    /// Return the notifications by user
    /// </returns>
    [HttpGet]
    public async Task<ActionResult<PageData<NotificationResponse>>> GetNotificationsByUser(
        [FromServices] INotificationService notificationService,
        CancellationToken cancellationToken)
    {
        return (await notificationService.GetByUserAsync(
                Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? ""), cancellationToken))
            .ToResponse();
    }


    [HttpPost("{notificationId:Guid}/read")]
    public async Task<ActionResult<bool>> MarkNotificationAsRead(
        [FromServices] INotificationService notificationService,
        [FromRoute] Guid notificationId,
        CancellationToken cancellationToken)
    {
        return (await notificationService.MarkAsReadAsync(
                notificationId, 
                Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? ""), 
                cancellationToken))
            .ToResponse();
    }

    [HttpPost("read")]
    public async Task<ActionResult<bool>> MarkAllAsRead(
        [FromServices] INotificationService notificationService,
        CancellationToken cancellationToken)
    {
        return (await notificationService.MarkAllAsReadAsync(
                Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? ""), cancellationToken))
            .ToResponse();
    }
}
