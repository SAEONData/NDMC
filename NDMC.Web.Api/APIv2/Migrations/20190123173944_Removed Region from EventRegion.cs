using Microsoft.EntityFrameworkCore.Migrations;

namespace APIv2.Migrations
{
    public partial class RemovedRegionfromEventRegion : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EventRegions_Regions_RegionId",
                table: "EventRegions");

            migrationBuilder.DropIndex(
                name: "IX_EventRegions_RegionId",
                table: "EventRegions");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_EventRegions_RegionId",
                table: "EventRegions",
                column: "RegionId");

            migrationBuilder.AddForeignKey(
                name: "FK_EventRegions_Regions_RegionId",
                table: "EventRegions",
                column: "RegionId",
                principalTable: "Regions",
                principalColumn: "RegionId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
