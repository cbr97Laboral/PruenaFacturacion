#region Usings
using BackendFacturaRapida.Models.DB;
using BackendFacturaRapida.Repositories.ClienteRepository;
using BackendFacturaRapida.Repositories.Productos;
using BackendFacturaRapida.Repositories.FacturaRepository.Cabecera;
using BackendFacturaRapida.Repositories.FacturaRepository.Detalle;
using Microsoft.EntityFrameworkCore;
using BackendFacturaRapida.Utilidades;
using BackendFacturaRapida.Repositories.Users;
using BackendFacturaRapida.Repositories.Login;
#endregion

var builder = WebApplication.CreateBuilder(args);

//--Configuración de servios
#region JWT services
builder.Services.AddAuthorization();
Token.AddJwtAuthentication(builder.Services);
#endregion

#region BD services
builder.Services.AddDbContext<FacturacionRapidaDevContext>(options =>
options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnectionTest")));
#endregion

#region CORS
// Habilitar CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder =>
        {
            builder.WithOrigins("http://localhost:5173") // Frontend
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
});
#endregion

builder.Services.AddControllers();

#region Registro de repositorios
builder.Services.AddScoped<IUsersRepository, UsersRepository>();
builder.Services.AddScoped<ILoginControlRepository, LoginControlRepository>();

builder.Services.AddScoped<IClienteRepository, ClienteRepository>();
builder.Services.AddScoped<IProductosRepository, ProductosRepository>();

builder.Services.AddScoped<IFacturasDetallesRepository, FacturasDetallesRepository>();
builder.Services.AddScoped<IFacturasCabecerasRepository, FacturasCabecerasRepository>();
#endregion

#region Swagger services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
#endregion

//--Contrucción de App
var app = builder.Build();

#region Uso basico
app.UseHttpsRedirection();
app.MapControllers();
#endregion

#region Uso de Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
#endregion

#region Uso de cors
app.UseCors("AllowSpecificOrigin");
#endregion

#region Uso de JWT
app.UseAuthentication();
#endregion;

#region Seguridad
app.UseAuthorization();
#endregion

app.Run();
