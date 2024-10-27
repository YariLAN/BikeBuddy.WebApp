﻿using BikeBuddy.Application.DtoModels.Auth;
using BikeBuddy.Application.Services.Auth.Login;
using BikeBuddy.Application.Services.Auth.Logout;
using BikeBuddy.Application.Services.Auth.Refresh;
using BikeBuddy.Application.Services.Auth.Register;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

using Auth = BikeBuddy.Application.DtoModels.Auth;

namespace BikeBuddy.API.Controllers
{
    [Route("auth/")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login(
            [FromServices] ILoginService loginService,
            [FromBody] Auth.LoginRequest loginRequest,
            CancellationToken token)
        {
            if (HttpContext.User.Identity!.IsAuthenticated)
                return Conflict();

            var result = await loginService.ExecuteAsync(loginRequest, HttpContext, token);

            if (result.IsFailure)
                return BadRequest(result.Error);

            return Ok(result.Value);
        }

        [HttpPost("logout")]
        public async Task<ActionResult<AuthResponse>> Logout(
            [FromServices] ILogoutService logoutService,
            CancellationToken token)
        {
            if (!HttpContext.User.Identity!.IsAuthenticated)
                return Conflict();

            var result = await logoutService.ExecuteAsync(HttpContext, token);

            if (result.IsFailure)
                return BadRequest(result.Error);

            return Ok(result.Value);
        }

        [HttpPost("register")]
        public async Task<ActionResult<Guid>> RegisterAsync(
            [FromServices] IRegisterService registerService,
            [FromBody] Auth.RegisterRequest request,
            CancellationToken cancellationToken)
        {
            if (HttpContext.User.Identity!.IsAuthenticated)
                return Conflict();

            var result = await registerService.ExecuteAsync(request, cancellationToken);

            if (result.IsFailure)
                return BadRequest(result.Error);

            return Ok(result.Value);
        }

        [HttpPost("refresh")]
        public async Task<ActionResult<AuthResponse>> RefreshAsync(
            [FromServices] IRefreshService refreshService,
            CancellationToken cancellationToken)
        {
            var result = await refreshService.ExecuteAsync(HttpContext, cancellationToken);

            if (result.IsFailure)
                return Forbid();

            return Ok(result.Value);
        }
    }
}
