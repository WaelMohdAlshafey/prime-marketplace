using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Marketplace.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPageClasses : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CssClass",
                table: "Pages",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PageClassId",
                table: "Pages",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "PageClasses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Slug = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Icon = table.Column<string>(type: "text", nullable: true),
                    ColorClass = table.Column<string>(type: "text", nullable: true),
                    DisplayOrder = table.Column<int>(type: "integer", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PageClasses", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Pages_PageClassId",
                table: "Pages",
                column: "PageClassId");

            migrationBuilder.CreateIndex(
                name: "IX_PageClasses_Slug",
                table: "PageClasses",
                column: "Slug",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Pages_PageClasses_PageClassId",
                table: "Pages",
                column: "PageClassId",
                principalTable: "PageClasses",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Pages_PageClasses_PageClassId",
                table: "Pages");

            migrationBuilder.DropTable(
                name: "PageClasses");

            migrationBuilder.DropIndex(
                name: "IX_Pages_PageClassId",
                table: "Pages");

            migrationBuilder.DropColumn(
                name: "CssClass",
                table: "Pages");

            migrationBuilder.DropColumn(
                name: "PageClassId",
                table: "Pages");
        }
    }
}
