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

            optionsBuilder.UseNpgsql(
     "Host=db.rgnanibivkruuryndplle.supabase.co;Database=postgres;Username=postgres;Password=MyMarketplaceDB#2026!Secure;Port=5432;SslMode=Require;Trust Server Certificate=true;"
 );

            return new AppDbContext(optionsBuilder.Options);
        }
    }
}