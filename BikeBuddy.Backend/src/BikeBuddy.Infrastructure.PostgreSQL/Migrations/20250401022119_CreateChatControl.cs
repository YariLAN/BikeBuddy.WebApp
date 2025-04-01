using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BikeBuddy.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class CreateChatControl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "group_chats",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    description = table.Column<string>(type: "character varying(800)", maxLength: 800, nullable: false),
                    event_id = table.Column<Guid>(type: "uuid", nullable: true),
                    last_message_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_group_chats", x => x.id);
                    table.ForeignKey(
                        name: "fk_group_chats_events_event_id",
                        column: x => x.event_id,
                        principalTable: "events",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "members_group_chats",
                columns: table => new
                {
                    group_chat_id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    role = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_members_group_chats", x => new { x.group_chat_id, x.user_id });
                    table.ForeignKey(
                        name: "fk_members_group_chats_auth_users_user_id",
                        column: x => x.user_id,
                        principalTable: "auth_users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_members_group_chats_group_chats_group_chat_id",
                        column: x => x.group_chat_id,
                        principalTable: "group_chats",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "messages",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    group_chat_id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: true),
                    content = table.Column<string>(type: "character varying(5000)", maxLength: 5000, nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_messages", x => x.id);
                    table.ForeignKey(
                        name: "fk_messages_auth_users_user_id",
                        column: x => x.user_id,
                        principalTable: "auth_users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "fk_messages_group_chats_group_chat_id",
                        column: x => x.group_chat_id,
                        principalTable: "group_chats",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_group_chats_event_id",
                table: "group_chats",
                column: "event_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_members_group_chats_user_id",
                table: "members_group_chats",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_messages_group_chat_id",
                table: "messages",
                column: "group_chat_id");

            migrationBuilder.CreateIndex(
                name: "ix_messages_user_id",
                table: "messages",
                column: "user_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "members_group_chats");

            migrationBuilder.DropTable(
                name: "messages");

            migrationBuilder.DropTable(
                name: "group_chats");
        }
    }
}
