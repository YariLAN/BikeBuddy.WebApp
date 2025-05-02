using BikeBuddy.API.Shared.Extensions;
using BikeBuddy.Application.Services.Event.UploadMapService;
using BikeBuddy.Application.Services.Profile.UploadAvatarService;
using Microsoft.AspNetCore.Mvc;

namespace BikeBuddy.API.Controllers
{
    [Route("file/")]
    [ApiController]
    public class FileController : ControllerBase
    {
        [HttpPost("{eventId}/upload-route")]
        public async Task<ActionResult<string>> UploadImageOfRoute(
            [FromRoute] Guid eventId,
            IFormFile file,
            [FromServices] IUploadMapService uploadFileService,
            CancellationToken cancellationToken)
        {
            var resutUpload = await uploadFileService.ExecuteAsync(eventId, file, cancellationToken);

            return resutUpload.ToResponse();
        }

        [HttpPost("{userId:guid}/upload-avatar")]
        public async Task<ActionResult<string>> UploadAvatar(
            [FromRoute] Guid userId,
            IFormFile file,
            [FromServices] IUploadAvatarService uploadAvatarService,
            CancellationToken cancellationToken)
        {
            return (await uploadAvatarService.ExecuteAsync(userId, file, cancellationToken)).ToResponse();
        }
    }
}
