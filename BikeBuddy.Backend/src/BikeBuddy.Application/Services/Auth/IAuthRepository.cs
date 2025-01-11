using BikeBuddy.Domain.Models.AuthControl;

namespace BikeBuddy.Application.Services.Auth;

public interface IAuthRepository
{
    Task<AuthUser?> GetAsync(Guid id, CancellationToken token);
    Task<AuthUser?> GetByEmailAsync(string email, CancellationToken token);
    Task<AuthUser?> GetByUsernameAsync(string username, CancellationToken token);
    Task<AuthUser?> GetByEmailOrUsernamesAsync(string login, CancellationToken token);

    Task<bool> UpdateLastLoginAtAsync(Guid userId, CancellationToken token);
    Task<Guid> CreateAsync(AuthUser user, CancellationToken token);
}
