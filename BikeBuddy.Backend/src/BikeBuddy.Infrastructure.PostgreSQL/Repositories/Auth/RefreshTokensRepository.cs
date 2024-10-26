using BikeBuddy.Application.Services.Auth;
using BikeBuddy.Domain.Models.AuthControl;
using Microsoft.EntityFrameworkCore;

namespace BikeBuddy.Infrastructure.Repositories.Auth;

public class RefreshTokensRepository(ApplicationDbContext context) : IRefreshTokensRepository
{
    public async Task<bool> Create(UserRefreshToken refreshToken, CancellationToken token)
    {
        try
        {
            await context.RefreshTokens.AddAsync(refreshToken, token);
            await context.SaveChangesAsync(token);

            return true;
        }
        catch { return false;}
    }

    public async Task<UserRefreshToken?> Get(Guid userId, CancellationToken token)
    {
        return await context.RefreshTokens
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.UserId == userId, token);
    }
}
