using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Marketplace.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddStoreTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Idempotent: create the "Stores" table only if it does not already exist
            migrationBuilder.Sql(@"
                CREATE TABLE IF NOT EXISTS ""Stores"" (
                    ""Id"" INTEGER NOT NULL,
                    ""Name"" TEXT NOT NULL,
                    ""LogoUrl"" TEXT NULL,
                    ""Description"" TEXT NULL,
                    ""VendorId"" INTEGER NOT NULL,
                    ""IsActive"" INTEGER NOT NULL,
                    ""CreatedAt"" TEXT NOT NULL,
                    CONSTRAINT ""PK_Stores"" PRIMARY KEY (""Id""),
                    CONSTRAINT ""FK_Stores_Users_VendorId"" FOREIGN KEY (""VendorId"") 
                        REFERENCES ""Users"" (""Id"") ON DELETE RESTRICT
                );
            ");

            // Idempotent: create the unique index only if it does not already exist
            migrationBuilder.Sql(@"
                CREATE UNIQUE INDEX IF NOT EXISTS ""IX_Stores_VendorId"" 
                    ON ""Stores"" (""VendorId"");
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Drop the table only if it exists
            migrationBuilder.Sql(@"
                DROP TABLE IF EXISTS ""Stores"";
            ");
        }
    }
}