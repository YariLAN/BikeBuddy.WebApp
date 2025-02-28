using BikeBuddy.API.Shared.Extensions;
using BikeBuddy.Application.DtoModels.Event;
using BikeBuddy.Application.Services.Event.CreateEventService;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BikeBuddy.API.Controllers
{
    [Route("events/")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [ApiController]
    public class EventController : ControllerBase
    {
        [HttpPost]
        public async Task<ActionResult<Guid>> CreateEvent(
        [FromServices] ICreateEventService createEventService,
        [FromBody] CreateEventRequest request,
        CancellationToken cancellationToken)
        {
            var result = await createEventService.ExecuteAsync(request, cancellationToken);

            return result.ToResponse();
        }
    }
}
