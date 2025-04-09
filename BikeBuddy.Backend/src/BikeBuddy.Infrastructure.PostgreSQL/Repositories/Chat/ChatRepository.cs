using BikeBuddy.Application.Services.Chat;
using BikeBuddy.Domain.Models.ChatControl;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;
using Microsoft.EntityFrameworkCore;
using static BikeBuddy.Domain.Shared.Errors;

namespace BikeBuddy.Infrastructure.Repositories.Chat;

public class ChatRepository(ApplicationDbContext context) : IChatRepository
{
    public async Task<Result<Guid, Error>> CreateAsync(GroupChat chat, CancellationToken cancellationToken)
    {
        try
        {
            await context.Chats.AddAsync(chat, cancellationToken);

            await context.SaveChangesAsync(cancellationToken);

            return chat.Id;
        }
        catch
        {
            return Error.Failure("Ошибка добавления группового чата");
        }
    }

    public async Task<Result<GroupChat, Error>> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var chat = await context.Chats
            .Include(c => c.Members)
            .Include(c => c.Messages)
                .ThenInclude(m => m.AuthUser)
            .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);

        if (chat is null)
            return General.NotFound(id);

        return chat;
    }

    public Result<bool, Error> IsMemberOfChat(GroupChat chat, Guid userId)
    {
        var isMember = chat.Members.Any(m => m == userId);

        return isMember ? true : Errors.General.NotFound(userId);
    }

    public async Task<Result<bool, Error>> UpdateAsync(GroupChat chat, CancellationToken cancellationToken)
    {
        try
        {
            var getUser = (await GetByIdAsync(chat.Id, cancellationToken));

            if (getUser.IsFailure)
                return getUser.Error;

            context.Chats.Update(chat);
            await context.SaveChangesAsync(cancellationToken);
            return true;
        }
        catch (Exception ex)
        {
            return Error.Failure($"Ошибка обновления чата: {ex.Message}");
        }
    }
}
