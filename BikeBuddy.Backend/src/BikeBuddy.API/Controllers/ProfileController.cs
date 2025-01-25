using BikeBuddy.API.Shared.Extensions;
using BikeBuddy.Application.DtoModels.Profile;
using BikeBuddy.Application.Services.Profile.GetProfileService;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BikeBuddy.API.Controllers;

[Route("profile/")]
[ApiController]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class ProfileController : ControllerBase
{
    [HttpGet("{userId:guid}")]
    public async Task<ActionResult<UserProfileResponse>> GetUserProfile(
        [FromServices] IGetProfileService getProfileService,
        Guid userId, 
        CancellationToken cancellationToken)
    {
        var userProfile = await getProfileService.ExecuteAsync(userId, cancellationToken);

        return userProfile.ToResponse();
    }
}

