using Microsoft.EntityFrameworkCore.Migrations;

namespace APIv2.Migrations
{
    public partial class AddedEventImpactUnitOfMeasure : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UnitOfMeasure",
                table: "EventImpacts",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UnitOfMeasure",
                table: "EventImpacts");
        }
    }
}
