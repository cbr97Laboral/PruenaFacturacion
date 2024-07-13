using BackendFacturaRapida.Models.DB;

namespace BackendFacturaRapida.Repositories.Users
{
    public interface IUsersRepository
    {
        Task<IEnumerable<User>> GetUsersAsync();
        Task<User> GetUserByIdAsync(int id);
        Task<User?> GetUserByUsernameAsync(string username);
        Task<User?> GetUsuarioLoginAsync(string userName, string encryptedPassword);
        Task InsertUserAsync(User user);
        Task UpdateUserAsync(User user);
        Task DeleteUserAsync(int id);
        bool UserExists(int id);
    }
}
