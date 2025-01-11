using BikeBuddy.Application.Services.Auth;
using BikeBuddy.Domain.Models.AuthControl;
using Microsoft.EntityFrameworkCore;

namespace BikeBuddy.Infrastructure.Repositories.Auth;

public class AuthRepository(ApplicationDbContext context) : IAuthRepository
{
    public async Task<Guid> CreateAsync(AuthUser user, CancellationToken token)
    {
        await context.Users.AddAsync(user, token);

        await context.SaveChangesAsync(token);

        return user.Id;
    }

    public async Task<AuthUser?> GetAsync(Guid id, CancellationToken token)
    {
        var user = await context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id, token);

        return user;
    }

    public async Task<AuthUser?> GetByEmailAsync(string email, CancellationToken token)
    {
        var user = await context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Email == email, token);

        return user;
    }

    public async Task<AuthUser?> GetByEmailOrUsernamesAsync(string login, CancellationToken token)
    {
        var user = await GetByEmailAsync(login, token);

        return user is null
            ? await GetByUsernameAsync(login, token)
            : user;
    }

    public async Task<AuthUser?> GetByUsernameAsync(string username, CancellationToken token)
    {
        var user = await context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.UserName == username, token);

        return user;
    }

    public async Task<bool> UpdateLastLoginAtAsync(Guid userId, CancellationToken token)
    {
        var user = await GetAsync(userId, token);

        if (user is null)
            return false;

        user.UpdateLastLoginAt();

        context.Users.Update(user);
        await context.SaveChangesAsync(token);

        return true;
    }
}
