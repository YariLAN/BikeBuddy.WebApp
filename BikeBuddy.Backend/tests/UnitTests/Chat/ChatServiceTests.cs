using AutoFixture;
using BikeBuddy.Application.Mappers.Chat;
using BikeBuddy.Application.Services.Chat.GetChatMessagesService;
using BikeBuddy.Domain.Models.ChatControl;
using BikeBuddy.Domain.Models.ChatControl.Entities;
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
        var messages = AutoFixture.CreateMany<Message>(3).ToList();
        messages.ForEach(m => chat.AddMessage(m));
        
        ChatRepositoryMock.Setup(rep => 
            rep.GetByIdAsync(chat.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(chat)
            .Verifiable(Times.Exactly(1));
        
        ChatRepositoryMock.Setup(rep => 
            rep.IsMemberOfChat(chat, userId))
            .Returns(true)
            .Verifiable(Times.Exactly(1));
        
        var messageDtos = chat.GetMessages().ConvertAll(c => MessageMapper.ToMap(c, c.AuthUser));
        
        // act
        var result = await _getChatMessagesService.ExecuteAsync(chat.Id, userId, CancellationToken.None);


        result.Value.ShouldBe(messageDtos);
        
        ChatRepositoryMock.Verify();
    }
}