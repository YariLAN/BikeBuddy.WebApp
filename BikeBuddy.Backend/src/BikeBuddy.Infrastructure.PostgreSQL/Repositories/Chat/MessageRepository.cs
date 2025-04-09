using BikeBuddy.Application.Services.Chat;
using BikeBuddy.Domain.Models.ChatControl.Entities;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;

namespace BikeBuddy.Infrastructure.Repositories.Chat;

public class MessageRepository(
    ApplicationDbContext context) : IMessageRepository
{
    public async Task<Result<Guid, Error>> CreateAsync(Message message, CancellationToken cancellationToken)
    {
        try
        {
            await context.AddAsync(message, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
            
            return message.Id;
        }
        catch (Exception ex) {
            return Error.Failure($"Ошибка создания сообщения: {ex.Message}");
        }
    }
}
