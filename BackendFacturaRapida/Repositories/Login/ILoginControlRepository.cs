using BackendFacturaRapida.Models.DB;

namespace BackendFacturaRapida.Repositories.Login
{
    public interface ILoginControlRepository
    {
        Task<LoginControl> GetLoginControlByUsernameAsync(string username);
        Task InsertLoginControlAsync(LoginControl loginControl);
        Task UpdateLoginControlAsync(LoginControl loginControl);
    }
}
