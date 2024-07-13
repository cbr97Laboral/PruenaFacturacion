using BackendFacturaRapida.Models.DB;
using Microsoft.EntityFrameworkCore;

namespace BackendFacturaRapida.Repositories.Login
{
    public class LoginControlRepository: ILoginControlRepository
    {
        private readonly FacturacionRapidaDevContext _context;

        public LoginControlRepository(FacturacionRapidaDevContext context)
        {
            _context = context;
        }

         public async Task<LoginControl> GetLoginControlByUsernameAsync(string username)
        {
            return await _context.LoginControls.FirstOrDefaultAsync(lc => lc.Username == username);
        }

        public async Task InsertLoginControlAsync(LoginControl loginControl)
        {
            _context.LoginControls.Add(loginControl);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateLoginControlAsync(LoginControl loginControl)
        {
            _context.Entry(loginControl).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }
    }
}
