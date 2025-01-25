using BikeBuddy.API.Shared.Extensions;
using BikeBuddy.Application.DtoModels.Auth;
using BikeBuddy.Application.Services.Auth.Login;
using BikeBuddy.Application.Services.Auth.Logout;
using BikeBuddy.Application.Services.Auth.Refresh;
using BikeBuddy.Application.Services.Auth.Register;
using BikeBuddy.Domain.Shared;
using Microsoft.AspNetCore.Mvc;

namespace BikeBuddy.API.Controllers
{
    [Route("auth/")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login(
            [FromServices] ILoginService loginService,
            [FromBody] LoginRequest loginRequest,
            CancellationToken token)
        {
            if (HttpContext.User.Identity!.IsAuthenticated)
                return Error.Conflict("Уже авторизованы").ToResponse();

            var result = await loginService.ExecuteAsync(loginRequest, HttpContext, token);

            return result.ToResponse();
        }

        [HttpPost("logout")]
        public async Task<ActionResult<bool>> Logout(
            [FromServices] ILogoutService logoutService,
            CancellationToken token)
        {
            if (!HttpContext.User.Identity!.IsAuthenticated)
                return Error.Conflict("Уже авторизованы").ToResponse();

            var result = await logoutService.ExecuteAsync(HttpContext, token);

            return result.ToResponse();
        }

        [HttpPost("register")]
        public async Task<ActionResult<Guid>> RegisterAsync(
            [FromServices] IRegisterService registerService,
            [FromBody] RegisterRequest request,
            CancellationToken cancellationToken)
        {
            if (HttpContext.User.Identity!.IsAuthenticated)
                return Conflict();

            var result = await registerService.ExecuteAsync(request, cancellationToken);

            return result.ToResponse();
        }

        [HttpPost("refresh")]
        public async Task<ActionResult<AuthResponse>> RefreshAsync(
            [FromServices] IRefreshService refreshService,
            CancellationToken cancellationToken)
        {
            var result = await refreshService.ExecuteAsync(HttpContext, cancellationToken);

            return result.ToResponse();
        }

        //[HttpPost("login/signin_google")]
        //public async Task<ActionResult<AuthResponse>> LoginWithGoogle(
        //    [FromServices] IGoogleService googleService,
        //    [FromBody] string credential,
        //    CancellationToken cancellationToken)
        //{
        //    if (HttpContext.User.Identity!.IsAuthenticated)
        //        return Conflict();

        //    var result = await googleService.Login(credential, HttpContext, cancellationToken);

        //    if (result.IsFailure)
        //        return BadRequest(result.Error);

        //    return Ok(result.Value);
        //}
    }
}
