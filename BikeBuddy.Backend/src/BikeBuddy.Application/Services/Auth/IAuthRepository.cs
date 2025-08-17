using BikeBuddy.Domain.Models;
using BikeBuddy.Domain.Models.AuthControl;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Application.Services.Auth;

public interface IAuthRepository
{
    Task<AuthUser?> GetAsync(Guid id, CancellationToken token);
    
    Task<AuthUser?> GetByEmailAsync(string email, CancellationToken token);
    
    Task<AuthUser?> GetByUsernameAsync(string username, CancellationToken token);
    
    Task<AuthUser?> GetByEmailOrUsernamesAsync(string login, CancellationToken token);

    Task<bool> UpdateLastLoginAtAsync(Guid userId, CancellationToken token);
    
    Task<Guid> CreateAsync(AuthUser user, CancellationToken token);

    Task<AuthUser?> GetByConfirmationTokenOrDefaultAsync(string token, CancellationToken cancellationToken);

    Task<Result<bool, Error>> UpdateAsync(AuthUser user, CancellationToken cancellationToken);
}
