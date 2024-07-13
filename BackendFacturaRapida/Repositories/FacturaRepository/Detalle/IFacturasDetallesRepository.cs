using BackendFacturaRapida.Models.DB;

namespace BackendFacturaRapida.Repositories.FacturaRepository.Detalle
{
    public interface IFacturasDetallesRepository
    {
        Task<IEnumerable<FacturasDetalle>> GetAllAsync();
        Task<FacturasDetalle> GetByIdAsync(int id);
        Task AddAsync(FacturasDetalle facturasDetalle);
        Task UpdateAsync(FacturasDetalle facturasDetalle);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<IEnumerable<FacturasDetalle>> GetByFacturaIdAsync(int idFactura);
    }
}
