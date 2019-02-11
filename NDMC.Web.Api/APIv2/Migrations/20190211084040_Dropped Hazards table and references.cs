using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace APIv2.Migrations
{
    public partial class DroppedHazardstableandreferences : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Events_TypeEvents_TypeEventId",
                table: "Events");

            migrationBuilder.DropTable(
                name: "TypeEvents");

            migrationBuilder.DropIndex(
                name: "IX_Events_TypeEventId",
                table: "Events");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TypeEvents",
                columns: table => new
                {
                    TypeEventId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    TypeEventName = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TypeEvents", x => x.TypeEventId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Events_TypeEventId",
                table: "Events",
                column: "TypeEventId");

            migrationBuilder.AddForeignKey(
                name: "FK_Events_TypeEvents_TypeEventId",
                table: "Events",
                column: "TypeEventId",
                principalTable: "TypeEvents",
                principalColumn: "TypeEventId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
