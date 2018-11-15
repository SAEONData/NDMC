using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace APIv2.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RegionTypes",
                columns: table => new
                {
                    RegionTypeId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    RegionTypeName = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RegionTypes", x => x.RegionTypeId);
                });

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

            migrationBuilder.CreateTable(
                name: "TypeImpacts",
                columns: table => new
                {
                    TypeImpactId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    TypeImpactName = table.Column<string>(nullable: false),
                    UnitOfMeasure = table.Column<string>(nullable: true),
                    ParentTypeImpactId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TypeImpacts", x => x.TypeImpactId);
                    table.ForeignKey(
                        name: "FK_TypeImpacts_TypeImpacts_ParentTypeImpactId",
                        column: x => x.ParentTypeImpactId,
                        principalTable: "TypeImpacts",
                        principalColumn: "TypeImpactId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TypeMitigations",
                columns: table => new
                {
                    TypeMitigationId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    TypeMitigationName = table.Column<string>(nullable: false),
                    UnitOfMeasure = table.Column<string>(nullable: true),
                    ParentTypeMitigationId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TypeMitigations", x => x.TypeMitigationId);
                    table.ForeignKey(
                        name: "FK_TypeMitigations_TypeMitigations_ParentTypeMitigationId",
                        column: x => x.ParentTypeMitigationId,
                        principalTable: "TypeMitigations",
                        principalColumn: "TypeMitigationId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TypeSources",
                columns: table => new
                {
                    TypeSourceId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    TypeSourceName = table.Column<string>(nullable: false),
                    TypeSourceSource = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TypeSources", x => x.TypeSourceId);
                });

            migrationBuilder.CreateTable(
                name: "Regions",
                columns: table => new
                {
                    RegionId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    RegionName = table.Column<string>(nullable: false),
                    ParentRegionId = table.Column<int>(nullable: true),
                    RegionTypeId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Regions", x => x.RegionId);
                    table.ForeignKey(
                        name: "FK_Regions_Regions_ParentRegionId",
                        column: x => x.ParentRegionId,
                        principalTable: "Regions",
                        principalColumn: "RegionId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Regions_RegionTypes_RegionTypeId",
                        column: x => x.RegionTypeId,
                        principalTable: "RegionTypes",
                        principalColumn: "RegionTypeId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Events",
                columns: table => new
                {
                    EventId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    StartDate = table.Column<long>(nullable: true),
                    EndDate = table.Column<long>(nullable: true),
                    Location_WKT = table.Column<string>(nullable: true),
                    TypeEventId = table.Column<int>(nullable: true),
                    TypeSourceId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Events", x => x.EventId);
                    table.ForeignKey(
                        name: "FK_Events_TypeEvents_TypeEventId",
                        column: x => x.TypeEventId,
                        principalTable: "TypeEvents",
                        principalColumn: "TypeEventId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Events_TypeSources_TypeSourceId",
                        column: x => x.TypeSourceId,
                        principalTable: "TypeSources",
                        principalColumn: "TypeSourceId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "DeclaredEvents",
                columns: table => new
                {
                    DeclaredEventId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    DeclaredDate = table.Column<long>(nullable: true),
                    EventId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DeclaredEvents", x => x.DeclaredEventId);
                    table.ForeignKey(
                        name: "FK_DeclaredEvents_Events_EventId",
                        column: x => x.EventId,
                        principalTable: "Events",
                        principalColumn: "EventId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EventRegions",
                columns: table => new
                {
                    EventRegionId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    EventId = table.Column<int>(nullable: false),
                    RegionId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventRegions", x => x.EventRegionId);
                    table.ForeignKey(
                        name: "FK_EventRegions_Events_EventId",
                        column: x => x.EventId,
                        principalTable: "Events",
                        principalColumn: "EventId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EventRegions_Regions_RegionId",
                        column: x => x.RegionId,
                        principalTable: "Regions",
                        principalColumn: "RegionId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Mitigations",
                columns: table => new
                {
                    MitigationId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Date = table.Column<long>(nullable: true),
                    Value = table.Column<double>(nullable: true),
                    EventId = table.Column<int>(nullable: false),
                    TypeMitigationId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Mitigations", x => x.MitigationId);
                    table.ForeignKey(
                        name: "FK_Mitigations_Events_EventId",
                        column: x => x.EventId,
                        principalTable: "Events",
                        principalColumn: "EventId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Mitigations_TypeMitigations_TypeMitigationId",
                        column: x => x.TypeMitigationId,
                        principalTable: "TypeMitigations",
                        principalColumn: "TypeMitigationId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EventImpacts",
                columns: table => new
                {
                    EventImpactId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Measure = table.Column<double>(nullable: true),
                    EventRegionId = table.Column<int>(nullable: false),
                    TypeImpactId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventImpacts", x => x.EventImpactId);
                    table.ForeignKey(
                        name: "FK_EventImpacts_EventRegions_EventRegionId",
                        column: x => x.EventRegionId,
                        principalTable: "EventRegions",
                        principalColumn: "EventRegionId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EventImpacts_TypeImpacts_TypeImpactId",
                        column: x => x.TypeImpactId,
                        principalTable: "TypeImpacts",
                        principalColumn: "TypeImpactId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DeclaredEvents_EventId",
                table: "DeclaredEvents",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_EventImpacts_EventRegionId",
                table: "EventImpacts",
                column: "EventRegionId");

            migrationBuilder.CreateIndex(
                name: "IX_EventImpacts_TypeImpactId",
                table: "EventImpacts",
                column: "TypeImpactId");

            migrationBuilder.CreateIndex(
                name: "IX_EventRegions_EventId",
                table: "EventRegions",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_EventRegions_RegionId",
                table: "EventRegions",
                column: "RegionId");

            migrationBuilder.CreateIndex(
                name: "IX_Events_TypeEventId",
                table: "Events",
                column: "TypeEventId");

            migrationBuilder.CreateIndex(
                name: "IX_Events_TypeSourceId",
                table: "Events",
                column: "TypeSourceId");

            migrationBuilder.CreateIndex(
                name: "IX_Mitigations_EventId",
                table: "Mitigations",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_Mitigations_TypeMitigationId",
                table: "Mitigations",
                column: "TypeMitigationId");

            migrationBuilder.CreateIndex(
                name: "IX_Regions_ParentRegionId",
                table: "Regions",
                column: "ParentRegionId");

            migrationBuilder.CreateIndex(
                name: "IX_Regions_RegionTypeId",
                table: "Regions",
                column: "RegionTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_TypeImpacts_ParentTypeImpactId",
                table: "TypeImpacts",
                column: "ParentTypeImpactId");

            migrationBuilder.CreateIndex(
                name: "IX_TypeMitigations_ParentTypeMitigationId",
                table: "TypeMitigations",
                column: "ParentTypeMitigationId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DeclaredEvents");

            migrationBuilder.DropTable(
                name: "EventImpacts");

            migrationBuilder.DropTable(
                name: "Mitigations");

            migrationBuilder.DropTable(
                name: "EventRegions");

            migrationBuilder.DropTable(
                name: "TypeImpacts");

            migrationBuilder.DropTable(
                name: "TypeMitigations");

            migrationBuilder.DropTable(
                name: "Events");

            migrationBuilder.DropTable(
                name: "Regions");

            migrationBuilder.DropTable(
                name: "TypeEvents");

            migrationBuilder.DropTable(
                name: "TypeSources");

            migrationBuilder.DropTable(
                name: "RegionTypes");
        }
    }
}
