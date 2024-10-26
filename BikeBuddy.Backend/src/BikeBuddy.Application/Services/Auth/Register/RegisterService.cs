using BikeBuddy.Application.DtoModels.Auth;
using BikeBuddy.Application.Mappers.Auth;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Application.Services.Auth.Register;

public class RegisterService : IRegisterService
{
    private readonly IAuthRepository _authRepository;
    private readonly IPasswordHasher _passwordHasher;

    public RegisterService(
        IAuthRepository authRepository, 
        IPasswordHasher passwordHasher)
    {
        _authRepository = authRepository;
        _passwordHasher = passwordHasher;
    }

    public async Task<Result<Guid, string>> ExecuteAsync(RegisterRequest request, CancellationToken token)
    {
        var user = await _authRepository.GetByEmailAsync(request.Email, token);
        
        if (user is not null)
            return $"Пользователь с такой почтой {request.Email} уже существует";

        if (user?.UserName == request.UserName)
            return $"Пользователь с ником {request.UserName} уже существует";

        var passwordHash = _passwordHasher.Generate(request.Password);

        var authUser = AuthMapper.ToMap(request, passwordHash);

        return await _authRepository.CreateAsync(authUser, token);
    }
}