using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Marketplace.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddRatingToProducts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // This migration is intentionally empty because the "Rating" column
            // already exists in the production PostgreSQL database.
            // Adding it again would cause a duplicate column error.
            // The column has been present since the initial deployment, so no action is required.
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // No rollback needed; the column is already part of the schema.
        }
    }
}