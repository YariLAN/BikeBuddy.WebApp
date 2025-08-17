using BikeBuddy.Domain.Models.ChatControl.Entities;
using BikeBuddy.Domain.Models.EventControl;
using BikeBuddy.Domain.Models.NotificationControl;
using BikeBuddy.Domain.Models.ProfileControl;
using BikeBuddy.Domain.Shared;

namespace BikeBuddy.Domain.Models.AuthControl;

public sealed class AuthUser
{
    public Guid Id { get; private set; }

    public string Email { get; private set; } = string.Empty;

    public string PasswordHash { get; private set; } = string.Empty;

    public string UserName { get; private set; } = string.Empty;

    public bool IsVerified { get; private set; } = false;
    
    public string? ConfirmationToken { get; private set; }
    
    public DateTimeOffset? ConfirmationExpiresAt { get; private set; }

    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;

    public DateTime? LastLoginAt { get; private set; }

    public UserProfile UserProfile { get; private set; }

    public List<UserRefreshToken> RefreshTokens { get; private set; } = [];

    public List<Event> Events { get; private set; } = [];

    public List<MemberGroupChat> Membership { get; private set; } = [];

    public List<Message> Messages { get; private set; } = [];

    public List<Notification> NotificationMessages { get; private set; } = [];

    private AuthUser() { }

    private AuthUser(Guid id, string email, string username, string password, bool isVerified, DateTime createdAt, DateTime? lastLogin = null)
    {
        Id = id;
        Email = email;
        UserName = username;
        PasswordHash = password;
        IsVerified = isVerified;
        CreatedAt = createdAt;
        LastLoginAt = lastLogin;
    }

    public void UpdateLastLoginAt()
    {
        LastLoginAt = DateTime.UtcNow;
    }

    public void AddOrUpdateConfirmationData(bool isVerified, string? token = null, DateTimeOffset? expiresAt = null)
    {
        IsVerified = isVerified;
        ConfirmationToken = token;
        ConfirmationExpiresAt = expiresAt;
    }
    
    public static AuthUser Create(
        Guid id, 
        string email, 
        string username,
        string password, 
        bool isVerified, 
        DateTime createdAt, 
        DateTime? lastLogin = null)
    {
        return new AuthUser(id, email, username, password, isVerified, createdAt, lastLogin);
    }
}
