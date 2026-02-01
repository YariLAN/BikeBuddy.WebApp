using AutoFixture;
using AutoFixture.AutoMoq;
using BikeBuddy.Application.Services.Chat;
using Moq;

namespace UnitTests;

public abstract class TestBase
{
    protected readonly IFixture AutoFixture = new Fixture().Customize(new AutoMoqCustomization());
    
    protected readonly Mock<IMessageRepository> MessageRepositoryMock;
    protected readonly Mock<IChatRepository> ChatRepositoryMock;

    protected TestBase()
    {
        MessageRepositoryMock = new Mock<IMessageRepository>();
        ChatRepositoryMock = new Mock<IChatRepository>();
    }
}