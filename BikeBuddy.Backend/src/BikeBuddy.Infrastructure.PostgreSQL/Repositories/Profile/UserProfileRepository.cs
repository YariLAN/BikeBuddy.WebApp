using BikeBuddy.Application.Services.Profile;
using BikeBuddy.Domain.Models.ProfileControl;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;
using Microsoft.EntityFrameworkCore;

namespace BikeBuddy.Infrastructure.Repositories.Profile;

public class UserProfileRepository(ApplicationDbContext context) : IUserProfileRepository
{
    public async Task<Guid?> CreateAsync(UserProfile profile, CancellationToken cancellationToken)
    {
        try
        {
            await context.Profiles.AddAsync(profile, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);

            return profile.Id;
        }
        catch
        {
            return null;
        }
    }

    public async Task<UserProfile?> GetByUserIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var profile = await context.Profiles
            .Include(profile => profile.AuthUser)
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.UserId == id, cancellationToken);

        return profile;
    }

    public async Task<Result<bool, Error>> UpdateAsync(UserProfile profile, CancellationToken cancellationToken)
    {
        try
        {   
            context.Profiles.Update(profile);
    
            await context.SaveChangesAsync(cancellationToken);
    
            return true;
        }
        catch (Exception ex)
        {
            return Error.Failure(ex.Message);
        }
    }
}
