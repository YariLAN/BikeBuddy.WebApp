using BikeBuddy.Domain.Models;

namespace BikeBuddy.Application.Services.Profile;

public interface IUserProfileRepository
{
    Task<UserProfile?> GetByUserIdAsync(Guid id, CancellationToken cancellationToken);

    Task<Guid?> CreateAsync(UserProfile profile, CancellationToken cancellationToken);

    Task<bool> UpdateAsync(UserProfile profile, CancellationToken cancellationToken);
}
