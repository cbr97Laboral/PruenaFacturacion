using Microsoft.AspNetCore.Mvc;
using BackendFacturaRapida.Models.DB;
using BackendFacturaRapida.Repositories.Users;
using BackendFacturaRapida.Models.View.Login;
using BackendFacturaRapida.Utilidades;
using BackendFacturaRapida.Repositories.Login;

namespace BackendFacturaRapida.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUsersRepository _usersRepository;
        private readonly ILoginControlRepository _loginControlRepository;

        public UsersController(IUsersRepository userRepository, ILoginControlRepository loginControlRepository)
        {
            _usersRepository = userRepository;
            _loginControlRepository = loginControlRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            var users = await _usersRepository.GetUsersAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _usersRepository.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            return user;
        }

        
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            var loginControl = await _loginControlRepository.GetLoginControlByUsernameAsync(model.UserName);

            if (loginControl == null)
            {
                return BadRequest(new { message = "Credenciales incorrectas.", attemptsLeft = 0 });
            }

            if (loginControl.LoginAttempts >= 3)
            {
                return BadRequest(new { message = "Intentos de inicio de sesión excedidos.", attemptsLeft = loginControl.LoginAttempts });
            }

            var encryptedPassword = Seguridad.CifrarAES(model.Password);

            var userRegistrado = await _usersRepository.GetUsuarioLoginAsync(model.UserName, encryptedPassword);
            if (userRegistrado == null)
            {
                loginControl.LoginAttempts++;
                await _loginControlRepository.UpdateLoginControlAsync(loginControl);

                return Unauthorized(new { message = "Credenciales incorrectas.", attemptsLeft = loginControl.LoginAttempts });
            }

            loginControl.LoginAttempts = 0;
            await _loginControlRepository.UpdateLoginControlAsync(loginControl);


            var token = Token.GenerarToken(userRegistrado.Username);
            return Ok(new { token, attemptsLeft = loginControl.LoginAttempts });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.UserId)
            {
                return BadRequest();
            }

            await _usersRepository.UpdateUserAsync(user);

            return NoContent();
        }

        
         [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            var userFound = await _usersRepository.GetUserByUsernameAsync(user.Username);
            if (userFound != null)
            {
                return Conflict("El nombre de usuario ya está en uso.");
            }

            user.PasswordHash = Seguridad.CifrarAES(user.PasswordHash);

            await _usersRepository.InsertUserAsync(user);

            var loginControl = new LoginControl
            {
                Username = user.Username,
            };

            await _loginControlRepository.InsertLoginControlAsync(loginControl);

            return CreatedAtAction(nameof(GetUser), new { id = user.UserId }, user);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            if (!_usersRepository.UserExists(id))
            {
                return NotFound();
            }

            await _usersRepository.DeleteUserAsync(id);

            return NoContent();
        }
    }
}
