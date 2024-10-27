using BikeBuddy.Domain.Models.AuthControl;

namespace BikeBuddy.Application.Services.Auth;

public interface IRefreshTokensRepository
{
    public Task<UserRefreshToken?> Get(Guid userId, CancellationToken token);

    public Task<bool> Create(UserRefreshToken refreshToken, CancellationToken token);

    public Task<bool> Delete(Guid userId, string tokenValue, CancellationToken token);
}
