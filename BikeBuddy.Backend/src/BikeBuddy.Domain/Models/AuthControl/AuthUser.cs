using Microsoft.VisualBasic;

namespace BikeBuddy.Domain.Models.AuthControl;

public class AuthUser
{
    public Guid Id { get; private set; }

    public string Email { get; private set; } = string.Empty;

    public string PasswordHash { get; private set; } = string.Empty;

    public string UserName { get; private set; } = string.Empty;

    public bool IsVerified { get; private set; } = false;

    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;

    public DateTime? LastLoginAt { get; private set; }

    public UserProfile UserProfile { get; private set; }

    public UserRefreshToken RefreshToken { get; private set; }

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
