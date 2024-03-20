using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Goalpost.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class PlayIndexToLong : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<long>(
                name: "Index",
                table: "Plays",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "DefensiveFumbles",
                table: "Players",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DefensiveInterceptions",
                table: "Players",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DefensiveOnePointConversions",
                table: "Players",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DefensiveSacks",
                table: "Players",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DefensiveSafeties",
                table: "Players",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DefensiveTds",
                table: "Players",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DefensiveTwoPointConversions",
                table: "Players",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "FlagPulls",
                table: "Players",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Games",
                table: "Players",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "OffensiveFumbles",
                table: "Players",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "OffensiveSacks",
                table: "Players",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "OffensiveSafeties",
                table: "Players",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PassingAttempts",
                table: "Players",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PassingCompletions",
                table: "Players",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PassingInterceptions",
                table: "Players",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PassingOnePointConversions",
                table: "Players",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PassingTds",
                table: "Players",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PassingTwoPointConversions",
                table: "Players",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PassingYardage",
                table: "Players",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PointsScored",
                table: "Players",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ReceivingCompletions",
                table: "Players",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ReceivingOnePointConversions",
                table: "Players",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ReceivingTargets",
                table: "Players",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ReceivingTds",
                table: "Players",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ReceivingTwoPointConversions",
                table: "Players",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ReceivingYardage",
                table: "Players",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "RushingAttempts",
                table: "Players",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "RushingOnePointConversions",
                table: "Players",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "RushingTds",
                table: "Players",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "RushingTwoPointConversions",
                table: "Players",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "RushingYardage",
                table: "Players",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DefensiveSafeties",
                table: "PlayerGames",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "OffensiveSafeties",
                table: "PlayerGames",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DefensiveFumbles",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "DefensiveInterceptions",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "DefensiveOnePointConversions",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "DefensiveSacks",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "DefensiveSafeties",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "DefensiveTds",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "DefensiveTwoPointConversions",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "FlagPulls",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "Games",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "OffensiveFumbles",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "OffensiveSacks",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "OffensiveSafeties",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "PassingAttempts",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "PassingCompletions",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "PassingInterceptions",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "PassingOnePointConversions",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "PassingTds",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "PassingTwoPointConversions",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "PassingYardage",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "PointsScored",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "ReceivingCompletions",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "ReceivingOnePointConversions",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "ReceivingTargets",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "ReceivingTds",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "ReceivingTwoPointConversions",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "ReceivingYardage",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "RushingAttempts",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "RushingOnePointConversions",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "RushingTds",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "RushingTwoPointConversions",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "RushingYardage",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "DefensiveSafeties",
                table: "PlayerGames");

            migrationBuilder.DropColumn(
                name: "OffensiveSafeties",
                table: "PlayerGames");

            migrationBuilder.AlterColumn<int>(
                name: "Index",
                table: "Plays",
                type: "int",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint");
        }
    }
}
