﻿using BikeBuddy.Application.DtoModels.Common;
using BikeBuddy.Application.DtoModels.Event;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Application.Services.Event;

public interface IEventRepository
{
    Task<Result<Guid, Error>> CreateAsync(Domain.Models.EventControl.Event dbEvent, CancellationToken cancellationToken);

    Task<Result<List<Domain.Models.EventControl.Event>, Error>> GetEventsAsync(CancellationToken token);

    Task<Result<(List<Domain.Models.EventControl.Event>, int), Error>> GetEventsByFilterAsync(SearchFilterDto<EventFilterDto> eventFilter, CancellationToken token);
}
