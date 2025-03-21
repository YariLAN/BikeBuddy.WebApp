using BikeBuddy.Application.DtoModels.User.Auth;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Application.Services.Auth.Register;

public interface IRegisterService
{
    Task<Result<Guid, Error>> ExecuteAsync(RegisterRequest request, CancellationToken token);
}
