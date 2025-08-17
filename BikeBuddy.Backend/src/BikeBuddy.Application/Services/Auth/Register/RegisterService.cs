using System.Globalization;
using BikeBuddy.Application.DtoModels.User.Auth;
using BikeBuddy.Application.Mappers.User.Auth;
using BikeBuddy.Application.Services.Auth.Verify;
using BikeBuddy.Application.Services.Common;

using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Application.Services.Auth.Register;

public class RegisterService : IRegisterService
{
    private readonly IAuthRepository _authRepository;
    private readonly IPasswordHasher _passwordHasher;
    private IEmailService _emailService;
    private IEmailVerificationService _emailVerificationService;

    public RegisterService(
        IAuthRepository authRepository, 
        IPasswordHasher passwordHasher, 
        IEmailService emailService, 
        IEmailVerificationService emailValidateService)
    {
        _authRepository = authRepository;
        _passwordHasher = passwordHasher;
        _emailService = emailService;
        _emailVerificationService = emailValidateService;
    }

    public async Task<Result<Guid, Error>> ExecuteAsync(RegisterRequest request, CancellationToken ct)
    {
        var user = await _authRepository.GetByEmailAsync(request.Email, ct);
        
        if (user is not null)
            return Error.Conflict($"Пользователь с такой почтой {request.Email} уже существует");

        user = await _authRepository.GetByUsernameAsync(request.UserName, ct);

        if (user is not null)
            return Error.Conflict($"Пользователь с ником {request.UserName} уже существует");

        var passwordHash = _passwordHasher.Generate(request.Password);

        var authUser = AuthMapper.ToMap(request, passwordHash);

        var token = _emailVerificationService.GenerateConfirmationToken(
            new GenerateTokenCommand(authUser.Id, authUser.Email));
        
        authUser.AddOrUpdateConfirmationData(false, token.Token, token.ExpiresAt);

        var encodedToken = Uri.EscapeDataString(token.Token);
        
        await _emailService.SendToUserAsync(new SendEmailCommand(request.Email,
                "Подтвердите регистрацию на сайте",
                "Перейдите по ссылке ниже",
                $"auth/verify?userId={authUser.Id}&token={encodedToken}"), ct);

        return await _authRepository.CreateAsync(authUser, ct);
    }
}