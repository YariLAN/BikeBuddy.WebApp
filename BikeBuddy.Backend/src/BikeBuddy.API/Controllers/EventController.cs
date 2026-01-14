using BikeBuddy.API.Shared.Extensions;
using BikeBuddy.Application.DtoModels.Common;
using BikeBuddy.Application.DtoModels.Event;
using BikeBuddy.Application.Services.Event.CancelEventService;
using BikeBuddy.Application.Services.Event.ConfirmEventService;
using BikeBuddy.Application.Services.Event.CreateEventService;
using BikeBuddy.Application.Services.Event.GetEventService;
using BikeBuddy.Application.Services.Event.GetEventsService;
using BikeBuddy.Application.Services.Event.UpdateEventService;
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
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<Guid>> CreateEvent(
        [FromServices] ICreateEventService createEventService,
        [FromServices] IValidator<CreateEventRequest> validator,
        [FromForm] CreateEventRequest request,
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
        public async Task<ActionResult<EventResponseDetails>> GetEventAsync(
            [FromRoute] Guid eventId,
            [FromServices] IGetEventService getEventService,
            CancellationToken cancellationToken)
        {
            var result = await getEventService.ExecuteAsync(eventId, User, cancellationToken);

            return result.ToResponse();
        }

        [HttpDelete("{eventId:Guid}")]
        public async Task<ActionResult<bool>> CancelEventAsync(
            [FromRoute] Guid eventId,
            [FromServices] ICancelEventService cancelEventService,
            CancellationToken cancellationToken)
        {
            var result = await cancelEventService.ExecuteAsync(eventId, User, cancellationToken);

            return result.ToResponse();
        }

        [HttpPut("{eventId:Guid}")]
        public async Task<ActionResult<bool>> UpdateEventAsync(
            [FromServices] IUpdateEventService updateEventService,
            [FromServices] IValidator<UpdateEventRequest> validator,
            [FromRoute] Guid eventId,
            [FromBody] UpdateEventRequest request,
            CancellationToken cancellationToken)
        {
            return (await updateEventService.ExecuteAsync(eventId, request, User, cancellationToken)).ToResponse();
        }

        [HttpPost("{eventId:Guid}/confirm")]
        public async Task<ActionResult<bool>> ConfirmStartEventAsync(
            [FromServices] IConfirmEventService confirmEventService,
            [FromRoute] Guid eventId,
            CancellationToken cancellationToken)
        {
            return (await confirmEventService.ExecuteConfirmStartAsync(eventId, cancellationToken)).ToResponse();
        }  

        [HttpPost("{eventId:Guid}/finish")]
        public async Task<ActionResult<bool>> ConfirmFinishEventAsync(
            [FromServices] IConfirmEventService confirmEventService,
            [FromRoute] Guid eventId,
            CancellationToken cancellationToken)
        {
            return (await confirmEventService.ExecuteConfirmFinishAsync(eventId, cancellationToken)).ToResponse();
        }
    }
}
