using BikeBuddy.API.Shared.Extensions;
using BikeBuddy.Application.DtoModels.Profile;
using BikeBuddy.Application.Services.Profile.CreateProfileService;
using BikeBuddy.Application.Services.Profile.GetProfileService;
using BikeBuddy.Application.Services.Profile.UpdateProfileService;
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
    
    [HttpPost("{userId:guid}")]
    public async Task<ActionResult<bool>> CreateUserProfile(
        [FromServices] ICreateProfileService createProfileService,
        [FromRoute] string userId, 
        [FromBody] UserProfileRequest request,
        CancellationToken cancellationToken)
    {
        var result = await createProfileService.ExecuteAsync(Guid.Parse(userId), request, cancellationToken);

        return result.ToResponse();
    }     
    
    [HttpPut("{userId:guid}")]
    public async Task<ActionResult<bool>> UpdateUserProfile(
        [FromServices] IUpdateProfileService updateProfileService,
        [FromRoute] string userId,
        [FromBody] UserProfileRequest request,
        CancellationToken cancellationToken)
    {
        var result = await updateProfileService.ExecuteAsync(Guid.Parse(userId), request, cancellationToken);

        return result.ToResponse();
    }
}

