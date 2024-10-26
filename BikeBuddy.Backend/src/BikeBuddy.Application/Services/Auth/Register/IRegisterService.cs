using BikeBuddy.Application.DtoModels.Auth;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Application.Services.Auth.Register;

public interface IRegisterService
{
    Task<Result<Guid, string>> ExecuteAsync(RegisterRequest request, CancellationToken token);
}
