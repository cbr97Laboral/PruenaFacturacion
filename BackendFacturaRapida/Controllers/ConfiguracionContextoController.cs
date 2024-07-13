using BackendFacturaRapida.Repositories.Login;
using Microsoft.AspNetCore.Mvc;

namespace BackendFacturaRapida.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ConfiguracionContextoController : ControllerBase
    {
        private readonly ILoginControlRepository _loginControlRepository;

        public ConfiguracionContextoController(ILoginControlRepository loginControlRepository)
        {
            _loginControlRepository = loginControlRepository;
        }

        [HttpGet("intentosLogin/{id}")]
        public async Task<int> GetIntentosLoginById(int id)
        {
            var intentos = await _loginControlRepository.GetIntentosByIdAsync(id);
            return intentos;
        }
    }
}
