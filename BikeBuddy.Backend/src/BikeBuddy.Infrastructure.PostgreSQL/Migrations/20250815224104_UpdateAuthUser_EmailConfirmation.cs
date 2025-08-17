using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BikeBuddy.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAuthUser_EmailConfirmation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "confirmation_expires_at",
                table: "auth_users",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "confirmation_token",
                table: "auth_users",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "confirmation_expires_at",
                table: "auth_users");

            migrationBuilder.DropColumn(
                name: "confirmation_token",
                table: "auth_users");
        }
    }
}
