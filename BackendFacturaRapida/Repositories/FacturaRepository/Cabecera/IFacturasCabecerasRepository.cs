using BackendFacturaRapida.Models.DB;

namespace BackendFacturaRapida.Repositories.FacturaRepository.Cabecera
{
    public interface IFacturasCabecerasRepository
    {
        Task<IEnumerable<FacturasCabecera>> GetFacturasCabecerasAsync();
        Task<FacturasCabecera> GetFacturasCabeceraAsync(int id);
        Task AddFacturasCabeceraAsync(FacturasCabecera facturasCabecera);
        Task UpdateFacturasCabeceraAsync(FacturasCabecera facturasCabecera);
        Task DeleteFacturasCabeceraAsync(int id);
        Task<bool> FacturasCabeceraExistsAsync(int id);
    }
}
