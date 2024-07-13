using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace BackendFacturaRapida.Models.DB;

public partial class FacturacionRapidaDevContext : DbContext
{
    public FacturacionRapidaDevContext()
    {
    }

    public FacturacionRapidaDevContext(DbContextOptions<FacturacionRapidaDevContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Cliente> Clientes { get; set; }

    public virtual DbSet<ConfiguracionIntentosLogin> ConfiguracionIntentosLogins { get; set; }

    public virtual DbSet<FacturasCabecera> FacturasCabeceras { get; set; }

    public virtual DbSet<FacturasDetalle> FacturasDetalles { get; set; }

    public virtual DbSet<LoginControl> LoginControls { get; set; }

    public virtual DbSet<Producto> Productos { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Name=ConnectionStrings:DefaultConnectionTest");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Cliente>(entity =>
        {
            entity.HasKey(e => e.IdCliente).HasName("Clientes_PK");

            entity.Property(e => e.Activo)
                .HasDefaultValue(true)
                .HasColumnName("activo");
            entity.Property(e => e.Correo)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("correo");
            entity.Property(e => e.Direccion)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("direccion");
            entity.Property(e => e.FechaCreacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("fechaCreacion");
            entity.Property(e => e.Nombre)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("nombre");
            entity.Property(e => e.RazonSocial)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("razonSocial");
            entity.Property(e => e.RucDni)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("rucDni");
        });

        modelBuilder.Entity<ConfiguracionIntentosLogin>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("ConfiguracionIntentosLogin_PK");

            entity.ToTable("ConfiguracionIntentosLogin");

            entity.HasIndex(e => e.Intentos, "ConfiguracionIntentosLogin_UNIQUE").IsUnique();

            entity.Property(e => e.Intentos).HasColumnName("intentos");
        });

        modelBuilder.Entity<FacturasCabecera>(entity =>
        {
            entity.HasKey(e => e.IdFactura).HasName("Facturas_Cabecera_PK");

            entity.ToTable("Facturas_Cabecera");

            entity.HasIndex(e => e.NumeroFactura, "Facturas_Cabecera_UNIQUE").IsUnique();

            entity.Property(e => e.Correo)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("correo");
            entity.Property(e => e.Ivg)
                .HasComputedColumnSql("(([subtotal]*[ivgPorcentual])/(100.0))", true)
                .HasColumnType("numeric(38, 6)")
                .HasColumnName("ivg");
            entity.Property(e => e.IvgPorcentual)
                .HasColumnType("decimal(38, 2)")
                .HasColumnName("ivgPorcentual");
            entity.Property(e => e.NumeroFactura).HasColumnName("numeroFactura");
            entity.Property(e => e.RazonSocialCliente)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("razonSocialCliente");
            entity.Property(e => e.RucDniCliente)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("rucDniCliente");
            entity.Property(e => e.Subtotal)
                .HasColumnType("decimal(38, 2)")
                .HasColumnName("subtotal");
            entity.Property(e => e.Total)
                .HasComputedColumnSql("([subtotal]+([subtotal]*[ivgPorcentual])/(100.0))", true)
                .HasColumnType("numeric(38, 2)")
                .HasColumnName("total");

            entity.HasOne(d => d.IdClienteNavigation).WithMany(p => p.FacturasCabeceras)
                .HasForeignKey(d => d.IdCliente)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("Facturas_Cabecera_Clientes_FK");
        });

        modelBuilder.Entity<FacturasDetalle>(entity =>
        {
            entity.HasKey(e => e.IdItem).HasName("Facturas_Detalle_PK");

            entity.ToTable("Facturas_Detalle");

            entity.Property(e => e.CantidadSolicitada).HasColumnName("cantidadSolicitada");
            entity.Property(e => e.CodigoProducto)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("codigoProducto");
            entity.Property(e => e.NombreProducto)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("nombreProducto");
            entity.Property(e => e.PrecioProducto)
                .HasColumnType("decimal(19, 2)")
                .HasColumnName("precioProducto");
            entity.Property(e => e.Subtotal)
                .HasComputedColumnSql("([cantidadSolicitada]*[precioProducto])", true)
                .HasColumnType("decimal(30, 2)")
                .HasColumnName("subtotal");

            entity.HasOne(d => d.IdFacturaNavigation).WithMany(p => p.FacturasDetalles)
                .HasForeignKey(d => d.IdFactura)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("Facturas_Detalle_Facturas_Cabecera_FK");

            entity.HasOne(d => d.IdProductoNavigation).WithMany(p => p.FacturasDetalles)
                .HasForeignKey(d => d.IdProducto)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("Facturas_Detalle_Productos_FK");
        });

        modelBuilder.Entity<LoginControl>(entity =>
        {
            entity.HasKey(e => e.LoginControlId).HasName("LoginControl_PK");

            entity.ToTable("LoginControl");

            entity.Property(e => e.LoginControlId).HasColumnName("loginControl_id");
            entity.Property(e => e.LoginAttempts).HasColumnName("login_attempts");
            entity.Property(e => e.Username)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("username");
        });

        modelBuilder.Entity<Producto>(entity =>
        {
            entity.HasKey(e => e.IdProducto).HasName("Productos_PK");

            entity.HasIndex(e => e.Codigo, "Productos_UNIQUE").IsUnique();

            entity.Property(e => e.Activo)
                .HasDefaultValue(true)
                .HasColumnName("activo");
            entity.Property(e => e.Codigo)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("codigo");
            entity.Property(e => e.FechaCreacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("fechaCreacion");
            entity.Property(e => e.Nombre)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("nombre");
            entity.Property(e => e.Precio)
                .HasColumnType("decimal(19, 2)")
                .HasColumnName("precio");
            entity.Property(e => e.Stock).HasColumnName("stock");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("Users_PK");

            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasColumnName("is_active");
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("password_hash");
            entity.Property(e => e.Username)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("username");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
