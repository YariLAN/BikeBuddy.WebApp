using BikeBuddy.Application.Services.Chat;
using BikeBuddy.Domain.Models.ChatControl;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

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
}
