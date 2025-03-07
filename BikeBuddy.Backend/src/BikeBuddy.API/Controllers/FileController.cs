using BikeBuddy.API.Shared.Extensions;
using BikeBuddy.Application.Services.Common;
using Microsoft.AspNetCore.Mvc;

namespace BikeBuddy.API.Controllers
{
    [Route("file/")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private const string MAP_IMAGE_FILENAME = "map.png";

        [HttpPost("{eventId}/upload-route")]
        public async Task<ActionResult<string>> UploadImageOfRoute(
            [FromRoute] Guid eventId,
            IFormFile file,
            [FromServices] IFileProvider fileProvider,
            CancellationToken cancellationToken)
        {
            var resutUpload = await fileProvider.UploadFileAsync(file, "event-images", $"{eventId}/{MAP_IMAGE_FILENAME}", cancellationToken);

            return resutUpload.ToResponse();
        }
    }
}
