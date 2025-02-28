using BikeBuddy.Domain.Models.ProfileControl;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Application.Services.Profile;

public interface IUserProfileRepository
{
    Task<UserProfile?> GetByUserIdAsync(Guid id, CancellationToken cancellationToken);

    Task<Guid?> CreateAsync(UserProfile profile, CancellationToken cancellationToken);

    Task<Result<bool, Error>> UpdateAsync(UserProfile profile, CancellationToken cancellationToken);
}
