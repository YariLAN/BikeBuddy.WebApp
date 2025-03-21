using BikeBuddy.API.Shared.Extensions;
using BikeBuddy.Application.DtoModels.Common;
using BikeBuddy.Application.DtoModels.Event;
using BikeBuddy.Application.Services.Event.CreateEventService;
using BikeBuddy.Application.Services.Event.GetEventService;
using BikeBuddy.Application.Services.Event.GetEventsService;
using FluentValidation;
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
        [HttpPost("create")]
        public async Task<ActionResult<Guid>> CreateEvent(
        [FromServices] ICreateEventService createEventService,
        [FromServices] IValidator<CreateEventRequest> validator,
        [FromBody] CreateEventRequest request,
        CancellationToken cancellationToken)
        {
            var result = await createEventService.ExecuteAsync(request, cancellationToken);

            return result.ToResponse();
        }

        [HttpPost]
        public async Task<ActionResult<PageData<EventListResponse>>> GetEventsAsync(
            [FromServices] IGetEventsService getEventsService,
            [FromBody] SearchFilterDto<EventFilterDto> request,
            CancellationToken cancellationToken)
        {
            var result = await getEventsService.ExecuteAsync(request, cancellationToken);

            return result.ToResponse();
        }

        [HttpGet("{eventId:Guid}")]
        public async Task<ActionResult<EventResponse>> GetEventAsync(
            [FromRoute] Guid eventId,
            [FromServices] IGetEventService getEventService,
            CancellationToken cancellationToken)
        {
            var result = await getEventService.ExecuteAsync(eventId, cancellationToken);

            return result.ToResponse();
        } 
    }
}
