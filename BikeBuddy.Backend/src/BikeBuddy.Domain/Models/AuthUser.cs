namespace BikeBuddy.Domain.Models;

public class AuthUser
{
    public Guid Id { get; private set; }

    public string Login { get; private set; } = string.Empty;

    public string Password { get; private set; } = string.Empty;

    private AuthUser() { }

    private AuthUser(Guid id, string login, string password)
    {
        Login = login;
        Password = password;
    }

    public static AuthUser Create(Guid id, string login, string password)
    {
        return new AuthUser(id, login, password);
    }
}
