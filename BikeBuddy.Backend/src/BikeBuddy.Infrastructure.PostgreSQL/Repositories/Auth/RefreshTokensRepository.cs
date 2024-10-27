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

    public async Task<bool> Delete(Guid userId, string tokenValue, CancellationToken token)
    {
        var refreshToken = await context.RefreshTokens
            .FirstOrDefaultAsync(_ => _.UserId == userId && _.RefreshToken.Equals(tokenValue));

        if (refreshToken is null)
            return false;

        context.RefreshTokens.Remove(refreshToken);
        await context.SaveChangesAsync(token);

        return true;
    }

    public async Task<UserRefreshToken?> Get(Guid userId, string tokenValue, CancellationToken token)
    {
        return await context.RefreshTokens
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.UserId == userId && x.RefreshToken.Equals(tokenValue), token);
    }
}
