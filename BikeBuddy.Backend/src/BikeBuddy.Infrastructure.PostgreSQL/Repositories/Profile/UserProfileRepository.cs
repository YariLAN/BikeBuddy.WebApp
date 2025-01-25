using BikeBuddy.Application.Services.Profile;
using BikeBuddy.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace BikeBuddy.Infrastructure.Repositories.Profile;

public class UserProfileRepository(ApplicationDbContext context) : IUserProfileRepository
{
    public async Task<Guid?> CreateAsync(UserProfile profile, CancellationToken cancellationToken)
    {
        await context.Profiles.AddAsync(profile, cancellationToken);

        await context.SaveChangesAsync(cancellationToken);

        return profile.Id;
    }

    public async Task<UserProfile?> GetByUserIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var profile = await context.Profiles
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.UserId == id, cancellationToken);

        return profile;
    }

    public async Task<bool> UpdateAsync(UserProfile profile, CancellationToken cancellationToken)
    {
        var exitingProfile = await context.Profiles
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == profile.Id, cancellationToken);

        if (exitingProfile is null)
            return false;

        exitingProfile.Update(profile.Surname, profile.Name, profile.MiddleName, profile.BirthDay, profile.Address);

        context.Profiles.Update(exitingProfile);

        await context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
