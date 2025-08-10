using BikeBuddy.Application.DtoModels.User.Auth;
using BikeBuddy.Application.Mappers.User.Auth;
using BikeBuddy.Application.Services.Common;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Application.Services.Auth.Register;

public class RegisterService : IRegisterService
{
    private readonly IAuthRepository _authRepository;
    private readonly IPasswordHasher _passwordHasher;
    private IEmailService _emailService;

    public RegisterService(
        IAuthRepository authRepository, 
        IPasswordHasher passwordHasher, 
        IEmailService emailService)
    {
        _authRepository = authRepository;
        _passwordHasher = passwordHasher;
        _emailService = emailService;
    }

    public async Task<Result<Guid, Error>> ExecuteAsync(RegisterRequest request, CancellationToken token)
    {
        var user = await _authRepository.GetByEmailAsync(request.Email, token);
        
        if (user is not null)
            return Error.Conflict($"Пользователь с такой почтой {request.Email} уже существует");

        user = await _authRepository.GetByUsernameAsync(request.UserName, token);

        if (user is not null)
            return Error.Conflict($"Пользователь с ником {request.UserName} уже существует");

        var passwordHash = _passwordHasher.Generate(request.Password);

        var authUser = AuthMapper.ToMap(request, passwordHash);

        await _emailService.SendToUserAsync(new SendEmailCommand(request.Email, 
                "Подтвердите регистрацию на сайте",
                "Перейдите по ссылке ниже"), token);

        return await _authRepository.CreateAsync(authUser, token);
    }
}