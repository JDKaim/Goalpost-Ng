using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Goalpost.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AddGameToPlays : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "GameId",
                table: "Plays",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Plays_GameId",
                table: "Plays",
                column: "GameId");

            migrationBuilder.AddForeignKey(
                name: "FK_Plays_Games_GameId",
                table: "Plays",
                column: "GameId",
                principalTable: "Games",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Plays_Games_GameId",
                table: "Plays");

            migrationBuilder.DropIndex(
                name: "IX_Plays_GameId",
                table: "Plays");

            migrationBuilder.DropColumn(
                name: "GameId",
                table: "Plays");
        }
    }
}
