using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BikeBuddy.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UserProfile_Update : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "photo_url",
                table: "user_profiles",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "photo_url",
                table: "user_profiles");
        }
    }
}
