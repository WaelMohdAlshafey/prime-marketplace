using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Marketplace.Infrastructure.Data;

namespace Marketplace.Infrastructure
{
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();

            // Use your live PostgreSQL connection string
            optionsBuilder.UseNpgsql(
                "Host=dpg-d9gdcfrbc2fs73fuacug-a.oregon-postgres.render.com;Database=prime_db_ty5u;Username=prime_user;Password=NSDiY1PDaON08IydKzrBLlQC84OTphBU;Port=5432;SslMode=Require"
            );

            return new AppDbContext(optionsBuilder.Options);
        }
    }
}