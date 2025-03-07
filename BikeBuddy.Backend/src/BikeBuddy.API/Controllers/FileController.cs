using BikeBuddy.API.Shared.Extensions;
using BikeBuddy.Application.Services.Common;
using Microsoft.AspNetCore.Mvc;

namespace BikeBuddy.API.Controllers
{
    [Route("file/")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private const string NAME_MAP_IMAGE = "map.png";

        [HttpPost("{eventId}/upload-route")]
        public async Task<ActionResult<string>> UploadPhotoOfRoute(
            [FromRoute] string eventId,
            [FromServices] IFileProvider _fileProvider,
            [FromBody] string dataUrl,
            CancellationToken cancellationToken)
        {
            var resultUpload = await _fileProvider.UploadFileAsync(dataUrl, "event-images", $"{eventId}/{NAME_MAP_IMAGE}", cancellationToken);

            return resultUpload.ToResponse();
        }
    }
}
