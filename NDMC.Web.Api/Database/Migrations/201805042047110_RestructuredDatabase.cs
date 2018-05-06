namespace Database.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RestructuredDatabase : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.AdminRegions", "ParentAdminRegion_AdminRegionId", "dbo.AdminRegions");
            DropForeignKey("dbo.DeclarationRegions", "AdminRegionId", "dbo.AdminRegions");
            DropForeignKey("dbo.TypeEvents", "ParentTypeEvent_TypeEventId", "dbo.TypeEvents");
            DropForeignKey("dbo.TypePressures", "ParentTypePressure_TypePressureId", "dbo.TypePressures");
            DropForeignKey("dbo.TypeEvents", "TypePressureId", "dbo.TypePressures");
            DropForeignKey("dbo.TypeStocks", "ParentTypeStock_TypeStockId", "dbo.TypeStocks");
            DropForeignKey("dbo.TypeEvents", "TypeStockId", "dbo.TypeStocks");
            DropForeignKey("dbo.Declarations", "TypeEventId", "dbo.TypeEvents");
            DropForeignKey("dbo.DeclarationRegions", "DeclarationId", "dbo.Declarations");
            DropForeignKey("dbo.Events", "AdminRegionId", "dbo.AdminRegions");
            DropForeignKey("dbo.Departments", "AdminRegionId", "dbo.AdminRegions");
            DropForeignKey("dbo.Mitigations", "StakeholderId", "dbo.Stakeholders");
            DropIndex("dbo.AdminRegions", new[] { "ParentAdminRegion_AdminRegionId" });
            DropIndex("dbo.DeclarationRegions", new[] { "AdminRegionId" });
            DropIndex("dbo.DeclarationRegions", new[] { "DeclarationId" });
            DropIndex("dbo.Declarations", new[] { "TypeEventId" });
            DropIndex("dbo.TypeEvents", new[] { "TypePressureId" });
            DropIndex("dbo.TypeEvents", new[] { "TypeStockId" });
            DropIndex("dbo.TypeEvents", new[] { "ParentTypeEvent_TypeEventId" });
            DropIndex("dbo.TypePressures", new[] { "ParentTypePressure_TypePressureId" });
            DropIndex("dbo.TypeStocks", new[] { "ParentTypeStock_TypeStockId" });
            DropIndex("dbo.Events", new[] { "AdminRegionId" });
            DropIndex("dbo.Departments", new[] { "AdminRegionId" });
            DropIndex("dbo.Mitigations", new[] { "StakeholderId" });
            CreateTable(
                "dbo.EventRegions",
                c => new
                    {
                        EventRegionId = c.Int(nullable: false, identity: true),
                        EventId = c.Int(nullable: false),
                        RegionId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.EventRegionId)
                .ForeignKey("dbo.Events", t => t.EventId, cascadeDelete: true)
                .ForeignKey("dbo.Regions", t => t.RegionId, cascadeDelete: true)
                .Index(t => t.EventId)
                .Index(t => t.RegionId);
            
            CreateTable(
                "dbo.Regions",
                c => new
                    {
                        RegionId = c.Int(nullable: false, identity: true),
                        RegionName = c.String(nullable: false),
                        ParentRegionId = c.Int(),
                        ParentRegion_RegionId = c.Int(),
                    })
                .PrimaryKey(t => t.RegionId)
                .ForeignKey("dbo.Regions", t => t.ParentRegion_RegionId)
                .Index(t => t.ParentRegion_RegionId);
            
            DropColumn("dbo.TypeEvents", "TypePressureId");
            DropColumn("dbo.TypeEvents", "TypeStockId");
            DropColumn("dbo.TypeEvents", "ParentTypeEventId");
            DropColumn("dbo.TypeEvents", "ParentTypeEvent_TypeEventId");
            DropColumn("dbo.Events", "AdminRegionId");
            DropColumn("dbo.Departments", "AdminRegionId");
            DropColumn("dbo.Mitigations", "StakeholderId");
            DropTable("dbo.AdminRegions");
            DropTable("dbo.DeclarationRegions");
            DropTable("dbo.Declarations");
            DropTable("dbo.TypePressures");
            DropTable("dbo.TypeStocks");
            DropTable("dbo.Stakeholders");
        }
        
        public override void Down()
        {
            CreateTable(
                "dbo.Stakeholders",
                c => new
                    {
                        StakeholderId = c.Int(nullable: false, identity: true),
                        StakeholderName = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.StakeholderId);
            
            CreateTable(
                "dbo.TypeStocks",
                c => new
                    {
                        TypeStockId = c.Int(nullable: false, identity: true),
                        TypeStockName = c.String(nullable: false),
                        ParentTypeStockId = c.Int(),
                        ParentTypeStock_TypeStockId = c.Int(),
                    })
                .PrimaryKey(t => t.TypeStockId);
            
            CreateTable(
                "dbo.TypePressures",
                c => new
                    {
                        TypePressureId = c.Int(nullable: false, identity: true),
                        TypePressureName = c.String(nullable: false),
                        ParentTypePressureId = c.Int(),
                        ParentTypePressure_TypePressureId = c.Int(),
                    })
                .PrimaryKey(t => t.TypePressureId);
            
            CreateTable(
                "dbo.Declarations",
                c => new
                    {
                        DeclarationId = c.Int(nullable: false, identity: true),
                        Date = c.DateTime(nullable: false),
                        Authority = c.String(nullable: false),
                        Document = c.String(nullable: false),
                        TypeEventId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.DeclarationId);
            
            CreateTable(
                "dbo.DeclarationRegions",
                c => new
                    {
                        DeclarationRegionId = c.Int(nullable: false, identity: true),
                        AdminRegionId = c.Int(nullable: false),
                        DeclarationId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.DeclarationRegionId);
            
            CreateTable(
                "dbo.AdminRegions",
                c => new
                    {
                        AdminRegionId = c.Int(nullable: false, identity: true),
                        AdminRegionName = c.String(nullable: false),
                        ParentAdminRegionId = c.Int(),
                        ParentAdminRegion_AdminRegionId = c.Int(),
                    })
                .PrimaryKey(t => t.AdminRegionId);
            
            AddColumn("dbo.Mitigations", "StakeholderId", c => c.Int(nullable: false));
            AddColumn("dbo.Departments", "AdminRegionId", c => c.Int(nullable: false));
            AddColumn("dbo.Events", "AdminRegionId", c => c.Int(nullable: false));
            AddColumn("dbo.TypeEvents", "ParentTypeEvent_TypeEventId", c => c.Int());
            AddColumn("dbo.TypeEvents", "ParentTypeEventId", c => c.Int());
            AddColumn("dbo.TypeEvents", "TypeStockId", c => c.Int());
            AddColumn("dbo.TypeEvents", "TypePressureId", c => c.Int());
            DropForeignKey("dbo.EventRegions", "RegionId", "dbo.Regions");
            DropForeignKey("dbo.Regions", "ParentRegion_RegionId", "dbo.Regions");
            DropForeignKey("dbo.EventRegions", "EventId", "dbo.Events");
            DropIndex("dbo.Regions", new[] { "ParentRegion_RegionId" });
            DropIndex("dbo.EventRegions", new[] { "RegionId" });
            DropIndex("dbo.EventRegions", new[] { "EventId" });
            DropTable("dbo.Regions");
            DropTable("dbo.EventRegions");
            CreateIndex("dbo.Mitigations", "StakeholderId");
            CreateIndex("dbo.Departments", "AdminRegionId");
            CreateIndex("dbo.Events", "AdminRegionId");
            CreateIndex("dbo.TypeStocks", "ParentTypeStock_TypeStockId");
            CreateIndex("dbo.TypePressures", "ParentTypePressure_TypePressureId");
            CreateIndex("dbo.TypeEvents", "ParentTypeEvent_TypeEventId");
            CreateIndex("dbo.TypeEvents", "TypeStockId");
            CreateIndex("dbo.TypeEvents", "TypePressureId");
            CreateIndex("dbo.Declarations", "TypeEventId");
            CreateIndex("dbo.DeclarationRegions", "DeclarationId");
            CreateIndex("dbo.DeclarationRegions", "AdminRegionId");
            CreateIndex("dbo.AdminRegions", "ParentAdminRegion_AdminRegionId");
            AddForeignKey("dbo.Mitigations", "StakeholderId", "dbo.Stakeholders", "StakeholderId", cascadeDelete: true);
            AddForeignKey("dbo.Departments", "AdminRegionId", "dbo.AdminRegions", "AdminRegionId", cascadeDelete: true);
            AddForeignKey("dbo.Events", "AdminRegionId", "dbo.AdminRegions", "AdminRegionId", cascadeDelete: true);
            AddForeignKey("dbo.DeclarationRegions", "DeclarationId", "dbo.Declarations", "DeclarationId", cascadeDelete: true);
            AddForeignKey("dbo.Declarations", "TypeEventId", "dbo.TypeEvents", "TypeEventId", cascadeDelete: true);
            AddForeignKey("dbo.TypeEvents", "TypeStockId", "dbo.TypeStocks", "TypeStockId");
            AddForeignKey("dbo.TypeStocks", "ParentTypeStock_TypeStockId", "dbo.TypeStocks", "TypeStockId");
            AddForeignKey("dbo.TypeEvents", "TypePressureId", "dbo.TypePressures", "TypePressureId");
            AddForeignKey("dbo.TypePressures", "ParentTypePressure_TypePressureId", "dbo.TypePressures", "TypePressureId");
            AddForeignKey("dbo.TypeEvents", "ParentTypeEvent_TypeEventId", "dbo.TypeEvents", "TypeEventId");
            AddForeignKey("dbo.DeclarationRegions", "AdminRegionId", "dbo.AdminRegions", "AdminRegionId", cascadeDelete: true);
            AddForeignKey("dbo.AdminRegions", "ParentAdminRegion_AdminRegionId", "dbo.AdminRegions", "AdminRegionId");
        }
    }
}
