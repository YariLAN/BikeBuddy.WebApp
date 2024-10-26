using BikeBuddy.Application.Services.Auth;
using BikeBuddy.Domain.Models.AuthControl;
using Microsoft.EntityFrameworkCore;

namespace BikeBuddy.Infrastructure.Repositories.Auth;

public class AuthRepository(ApplicationDbContext context) : IAuthRepository
{
    public async Task<Guid> CreateAsync(AuthUser user, CancellationToken token)
    {
        await context.Users.AddAsync(user, token);

        await context.SaveChangesAsync();

        return user.Id;
    }

    public Task<AuthUser> GetAsync(Guid id, CancellationToken token)
    {
        throw new NotImplementedException();
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
}
