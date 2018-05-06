namespace Database.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class InitialCreate : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.AdminRegions",
                c => new
                    {
                        AdminRegionId = c.Int(nullable: false, identity: true),
                        AdminRegionName = c.String(nullable: false),
                        ParentAdminRegionId = c.Int(nullable: false),
                        ParentAdminRegion_AdminRegionId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.AdminRegionId)
                .ForeignKey("dbo.AdminRegions", t => t.ParentAdminRegion_AdminRegionId)
                .Index(t => t.ParentAdminRegion_AdminRegionId);
            
            CreateTable(
                "dbo.DeclarationRegions",
                c => new
                    {
                        DeclarationRegionId = c.Int(nullable: false, identity: true),
                        AdminRegionId = c.Int(nullable: false),
                        DeclarationId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.DeclarationRegionId)
                .ForeignKey("dbo.AdminRegions", t => t.AdminRegionId, cascadeDelete: true)
                .ForeignKey("dbo.Declarations", t => t.DeclarationId, cascadeDelete: true)
                .Index(t => t.AdminRegionId)
                .Index(t => t.DeclarationId);
            
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
                .PrimaryKey(t => t.DeclarationId)
                .ForeignKey("dbo.TypeEvents", t => t.TypeEventId, cascadeDelete: true)
                .Index(t => t.TypeEventId);
            
            CreateTable(
                "dbo.TypeEvents",
                c => new
                    {
                        TypeEventId = c.Int(nullable: false, identity: true),
                        TypeEventName = c.String(nullable: false),
                        TypePressureId = c.Int(nullable: false),
                        TypeStockId = c.Int(nullable: false),
                        ParentTypeEventId = c.Int(nullable: false),
                        ParentTypeEvent_TypeEventId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.TypeEventId)
                .ForeignKey("dbo.TypeEvents", t => t.ParentTypeEvent_TypeEventId)
                .ForeignKey("dbo.TypePressures", t => t.TypePressureId, cascadeDelete: true)
                .ForeignKey("dbo.TypeStocks", t => t.TypeStockId, cascadeDelete: true)
                .Index(t => t.TypePressureId)
                .Index(t => t.TypeStockId)
                .Index(t => t.ParentTypeEvent_TypeEventId);
            
            CreateTable(
                "dbo.TypePressures",
                c => new
                    {
                        TypePressureId = c.Int(nullable: false, identity: true),
                        TypePressureName = c.String(nullable: false),
                        ParentTypePressureId = c.Int(nullable: false),
                        ParentTypePressure_TypePressureId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.TypePressureId)
                .ForeignKey("dbo.TypePressures", t => t.ParentTypePressure_TypePressureId)
                .Index(t => t.ParentTypePressure_TypePressureId);
            
            CreateTable(
                "dbo.TypeStocks",
                c => new
                    {
                        TypeStockId = c.Int(nullable: false, identity: true),
                        TypeStockName = c.String(nullable: false),
                        ParentTypeStockId = c.Int(nullable: false),
                        ParentTypeStock_TypeStockId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.TypeStockId)
                .ForeignKey("dbo.TypeStocks", t => t.ParentTypeStock_TypeStockId)
                .Index(t => t.ParentTypeStock_TypeStockId);
            
            CreateTable(
                "dbo.DeclaredEvents",
                c => new
                    {
                        DeclaredEventId = c.Int(nullable: false, identity: true),
                        Declared = c.DateTime(nullable: false),
                        EventId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.DeclaredEventId)
                .ForeignKey("dbo.Events", t => t.EventId, cascadeDelete: true)
                .Index(t => t.EventId);
            
            CreateTable(
                "dbo.Events",
                c => new
                    {
                        EventId = c.Int(nullable: false, identity: true),
                        EventName = c.String(nullable: false),
                        StartDate = c.DateTime(nullable: false),
                        EndDate = c.DateTime(nullable: false),
                        Location_WKT = c.String(),
                        TypeEventId = c.Int(nullable: false),
                        AdminRegionId = c.Int(nullable: false),
                        TypeSourceId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.EventId)
                .ForeignKey("dbo.AdminRegions", t => t.AdminRegionId, cascadeDelete: true)
                .ForeignKey("dbo.TypeEvents", t => t.TypeEventId, cascadeDelete: true)
                .ForeignKey("dbo.TypeSources", t => t.TypeSourceId, cascadeDelete: true)
                .Index(t => t.TypeEventId)
                .Index(t => t.AdminRegionId)
                .Index(t => t.TypeSourceId);
            
            CreateTable(
                "dbo.TypeSources",
                c => new
                    {
                        TypeSourceId = c.Int(nullable: false, identity: true),
                        TypeSourceName = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.TypeSourceId);
            
            CreateTable(
                "dbo.Departments",
                c => new
                    {
                        DepartmentId = c.Int(nullable: false, identity: true),
                        DepartmentName = c.String(nullable: false),
                        AdminRegionId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.DepartmentId)
                .ForeignKey("dbo.AdminRegions", t => t.AdminRegionId, cascadeDelete: true)
                .Index(t => t.AdminRegionId);
            
            CreateTable(
                "dbo.EventImpacts",
                c => new
                    {
                        EventImpactId = c.Int(nullable: false, identity: true),
                        Measure = c.Int(nullable: false),
                        UnitOfMeasure = c.String(nullable: false),
                        EventId = c.Int(nullable: false),
                        TypeImpactId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.EventImpactId)
                .ForeignKey("dbo.Events", t => t.EventId, cascadeDelete: true)
                .ForeignKey("dbo.TypeImpacts", t => t.TypeImpactId, cascadeDelete: true)
                .Index(t => t.EventId)
                .Index(t => t.TypeImpactId);
            
            CreateTable(
                "dbo.TypeImpacts",
                c => new
                    {
                        TypeImpactId = c.Int(nullable: false, identity: true),
                        TypeImpactName = c.String(nullable: false),
                        ParentTypeImpactId = c.Int(nullable: false),
                        ParentTypeImpact_TypeImpactId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.TypeImpactId)
                .ForeignKey("dbo.TypeImpacts", t => t.ParentTypeImpact_TypeImpactId)
                .Index(t => t.ParentTypeImpact_TypeImpactId);
            
            CreateTable(
                "dbo.Mitigations",
                c => new
                    {
                        MitigationId = c.Int(nullable: false, identity: true),
                        Date = c.DateTime(nullable: false),
                        Value = c.String(nullable: false),
                        DepartmentId = c.Int(),
                        StakeholderId = c.Int(nullable: false),
                        EventId = c.Int(nullable: false),
                        TypeMitigationId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.MitigationId)
                .ForeignKey("dbo.Departments", t => t.DepartmentId)
                .ForeignKey("dbo.Events", t => t.EventId, cascadeDelete: true)
                .ForeignKey("dbo.Stakeholders", t => t.StakeholderId, cascadeDelete: true)
                .ForeignKey("dbo.TypeMitigations", t => t.TypeMitigationId, cascadeDelete: true)
                .Index(t => t.DepartmentId)
                .Index(t => t.StakeholderId)
                .Index(t => t.EventId)
                .Index(t => t.TypeMitigationId);
            
            CreateTable(
                "dbo.Stakeholders",
                c => new
                    {
                        StakeholderId = c.Int(nullable: false, identity: true),
                        StakeholderName = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.StakeholderId);
            
            CreateTable(
                "dbo.TypeMitigations",
                c => new
                    {
                        TypeMitigationId = c.Int(nullable: false, identity: true),
                        TypeMitigationName = c.String(nullable: false),
                        ParentTypeMitigationId = c.Int(nullable: false),
                        ParentTypeMitigation_TypeMitigationId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.TypeMitigationId)
                .ForeignKey("dbo.TypeMitigations", t => t.ParentTypeMitigation_TypeMitigationId)
                .Index(t => t.ParentTypeMitigation_TypeMitigationId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Mitigations", "TypeMitigationId", "dbo.TypeMitigations");
            DropForeignKey("dbo.TypeMitigations", "ParentTypeMitigation_TypeMitigationId", "dbo.TypeMitigations");
            DropForeignKey("dbo.Mitigations", "StakeholderId", "dbo.Stakeholders");
            DropForeignKey("dbo.Mitigations", "EventId", "dbo.Events");
            DropForeignKey("dbo.Mitigations", "DepartmentId", "dbo.Departments");
            DropForeignKey("dbo.EventImpacts", "TypeImpactId", "dbo.TypeImpacts");
            DropForeignKey("dbo.TypeImpacts", "ParentTypeImpact_TypeImpactId", "dbo.TypeImpacts");
            DropForeignKey("dbo.EventImpacts", "EventId", "dbo.Events");
            DropForeignKey("dbo.Departments", "AdminRegionId", "dbo.AdminRegions");
            DropForeignKey("dbo.DeclaredEvents", "EventId", "dbo.Events");
            DropForeignKey("dbo.Events", "TypeSourceId", "dbo.TypeSources");
            DropForeignKey("dbo.Events", "TypeEventId", "dbo.TypeEvents");
            DropForeignKey("dbo.Events", "AdminRegionId", "dbo.AdminRegions");
            DropForeignKey("dbo.DeclarationRegions", "DeclarationId", "dbo.Declarations");
            DropForeignKey("dbo.Declarations", "TypeEventId", "dbo.TypeEvents");
            DropForeignKey("dbo.TypeEvents", "TypeStockId", "dbo.TypeStocks");
            DropForeignKey("dbo.TypeStocks", "ParentTypeStock_TypeStockId", "dbo.TypeStocks");
            DropForeignKey("dbo.TypeEvents", "TypePressureId", "dbo.TypePressures");
            DropForeignKey("dbo.TypePressures", "ParentTypePressure_TypePressureId", "dbo.TypePressures");
            DropForeignKey("dbo.TypeEvents", "ParentTypeEvent_TypeEventId", "dbo.TypeEvents");
            DropForeignKey("dbo.DeclarationRegions", "AdminRegionId", "dbo.AdminRegions");
            DropForeignKey("dbo.AdminRegions", "ParentAdminRegion_AdminRegionId", "dbo.AdminRegions");
            DropIndex("dbo.TypeMitigations", new[] { "ParentTypeMitigation_TypeMitigationId" });
            DropIndex("dbo.Mitigations", new[] { "TypeMitigationId" });
            DropIndex("dbo.Mitigations", new[] { "EventId" });
            DropIndex("dbo.Mitigations", new[] { "StakeholderId" });
            DropIndex("dbo.Mitigations", new[] { "DepartmentId" });
            DropIndex("dbo.TypeImpacts", new[] { "ParentTypeImpact_TypeImpactId" });
            DropIndex("dbo.EventImpacts", new[] { "TypeImpactId" });
            DropIndex("dbo.EventImpacts", new[] { "EventId" });
            DropIndex("dbo.Departments", new[] { "AdminRegionId" });
            DropIndex("dbo.Events", new[] { "TypeSourceId" });
            DropIndex("dbo.Events", new[] { "AdminRegionId" });
            DropIndex("dbo.Events", new[] { "TypeEventId" });
            DropIndex("dbo.DeclaredEvents", new[] { "EventId" });
            DropIndex("dbo.TypeStocks", new[] { "ParentTypeStock_TypeStockId" });
            DropIndex("dbo.TypePressures", new[] { "ParentTypePressure_TypePressureId" });
            DropIndex("dbo.TypeEvents", new[] { "ParentTypeEvent_TypeEventId" });
            DropIndex("dbo.TypeEvents", new[] { "TypeStockId" });
            DropIndex("dbo.TypeEvents", new[] { "TypePressureId" });
            DropIndex("dbo.Declarations", new[] { "TypeEventId" });
            DropIndex("dbo.DeclarationRegions", new[] { "DeclarationId" });
            DropIndex("dbo.DeclarationRegions", new[] { "AdminRegionId" });
            DropIndex("dbo.AdminRegions", new[] { "ParentAdminRegion_AdminRegionId" });
            DropTable("dbo.TypeMitigations");
            DropTable("dbo.Stakeholders");
            DropTable("dbo.Mitigations");
            DropTable("dbo.TypeImpacts");
            DropTable("dbo.EventImpacts");
            DropTable("dbo.Departments");
            DropTable("dbo.TypeSources");
            DropTable("dbo.Events");
            DropTable("dbo.DeclaredEvents");
            DropTable("dbo.TypeStocks");
            DropTable("dbo.TypePressures");
            DropTable("dbo.TypeEvents");
            DropTable("dbo.Declarations");
            DropTable("dbo.DeclarationRegions");
            DropTable("dbo.AdminRegions");
        }
    }
}
