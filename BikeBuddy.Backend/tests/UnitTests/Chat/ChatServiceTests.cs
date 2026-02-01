using AutoFixture;
using BikeBuddy.Application.Services.Chat.GetChatMessagesService;
using BikeBuddy.Domain.Models.ChatControl;
using BikeBuddy.Domain.Shared;
using CSharpFunctionalExtensions;
using Moq;
using Xunit;
using Shouldly;

namespace UnitTests.Chat;

public sealed class ChatServiceTests : TestBase
{
    private readonly GetChatMessagesService _getChatMessagesService;
    
    public ChatServiceTests()
    {
        _getChatMessagesService = new GetChatMessagesService(
            MessageRepositoryMock.Object, 
            ChatRepositoryMock.Object);
    }
    
    [Fact]
    public async Task GetChatMessages_ShouldReturnMesssages()
    {
        var userId = AutoFixture.Create<Guid>();
        var chat = AutoFixture.Create<GroupChat>();
        
        ChatRepositoryMock.Setup(rep => 
            rep.GetByIdAsync(chat.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(chat)
            .Verifiable(Times.Exactly(1));
        
        var result = await _getChatMessagesService.ExecuteAsync(chat.Id, userId, CancellationToken.None);
        
        Assert.NotNull(result.Value);
        
        ChatRepositoryMock.Verify(
            rep => rep.GetByIdAsync(chat.Id, It.IsAny<CancellationToken>()),
            Times.Once);
    }
}