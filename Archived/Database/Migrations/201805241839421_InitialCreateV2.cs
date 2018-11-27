namespace Database.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class InitialCreateV2 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.DeclaredEvents",
                c => new
                    {
                        DeclaredEventId = c.Int(nullable: false, identity: true),
                        DeclaredDate = c.Long(),
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
                        StartDate = c.Long(),
                        EndDate = c.Long(),
                        Location_WKT = c.String(),
                        TypeEventId = c.Int(),
                        TypeSourceId = c.Int(),
                    })
                .PrimaryKey(t => t.EventId)
                .ForeignKey("dbo.TypeEvents", t => t.TypeEventId)
                .ForeignKey("dbo.TypeSources", t => t.TypeSourceId)
                .Index(t => t.TypeEventId)
                .Index(t => t.TypeSourceId);
            
            CreateTable(
                "dbo.EventImpacts",
                c => new
                    {
                        EventImpactId = c.Int(nullable: false, identity: true),
                        Measure = c.Double(),
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
                        UnitOfMeasure = c.String(),
                        ParentTypeImpactId = c.Int(),
                    })
                .PrimaryKey(t => t.TypeImpactId)
                .ForeignKey("dbo.TypeImpacts", t => t.ParentTypeImpactId)
                .Index(t => t.ParentTypeImpactId);
            
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
                        RegionTypeId = c.Int(),
                    })
                .PrimaryKey(t => t.RegionId)
                .ForeignKey("dbo.Regions", t => t.ParentRegionId)
                .ForeignKey("dbo.RegionTypes", t => t.RegionTypeId)
                .Index(t => t.ParentRegionId)
                .Index(t => t.RegionTypeId);
            
            CreateTable(
                "dbo.RegionTypes",
                c => new
                    {
                        RegionTypeId = c.Int(nullable: false, identity: true),
                        RegionTypeName = c.String(),
                    })
                .PrimaryKey(t => t.RegionTypeId);
            
            CreateTable(
                "dbo.TypeEvents",
                c => new
                    {
                        TypeEventId = c.Int(nullable: false, identity: true),
                        TypeEventName = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.TypeEventId);
            
            CreateTable(
                "dbo.TypeSources",
                c => new
                    {
                        TypeSourceId = c.Int(nullable: false, identity: true),
                        TypeSourceName = c.String(nullable: false),
                        TypeSourceSource = c.String(),
                    })
                .PrimaryKey(t => t.TypeSourceId);
            
            CreateTable(
                "dbo.Departments",
                c => new
                    {
                        DepartmentId = c.Int(nullable: false, identity: true),
                        DepartmentName = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.DepartmentId);
            
            CreateTable(
                "dbo.Mitigations",
                c => new
                    {
                        MitigationId = c.Int(nullable: false, identity: true),
                        Date = c.Long(),
                        Value = c.Double(),
                        DepartmentId = c.Int(),
                        EventId = c.Int(nullable: false),
                        TypeMitigationId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.MitigationId)
                .ForeignKey("dbo.Departments", t => t.DepartmentId)
                .ForeignKey("dbo.Events", t => t.EventId, cascadeDelete: true)
                .ForeignKey("dbo.TypeMitigations", t => t.TypeMitigationId, cascadeDelete: true)
                .Index(t => t.DepartmentId)
                .Index(t => t.EventId)
                .Index(t => t.TypeMitigationId);
            
            CreateTable(
                "dbo.TypeMitigations",
                c => new
                    {
                        TypeMitigationId = c.Int(nullable: false, identity: true),
                        TypeMitigationName = c.String(nullable: false),
                        UnitOfMeasure = c.String(),
                        ParentTypeMitigationId = c.Int(),
                    })
                .PrimaryKey(t => t.TypeMitigationId)
                .ForeignKey("dbo.TypeMitigations", t => t.ParentTypeMitigationId)
                .Index(t => t.ParentTypeMitigationId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Mitigations", "TypeMitigationId", "dbo.TypeMitigations");
            DropForeignKey("dbo.TypeMitigations", "ParentTypeMitigationId", "dbo.TypeMitigations");
            DropForeignKey("dbo.Mitigations", "EventId", "dbo.Events");
            DropForeignKey("dbo.Mitigations", "DepartmentId", "dbo.Departments");
            DropForeignKey("dbo.DeclaredEvents", "EventId", "dbo.Events");
            DropForeignKey("dbo.Events", "TypeSourceId", "dbo.TypeSources");
            DropForeignKey("dbo.Events", "TypeEventId", "dbo.TypeEvents");
            DropForeignKey("dbo.EventRegions", "RegionId", "dbo.Regions");
            DropForeignKey("dbo.Regions", "RegionTypeId", "dbo.RegionTypes");
            DropForeignKey("dbo.Regions", "ParentRegionId", "dbo.Regions");
            DropForeignKey("dbo.EventRegions", "EventId", "dbo.Events");
            DropForeignKey("dbo.EventImpacts", "TypeImpactId", "dbo.TypeImpacts");
            DropForeignKey("dbo.TypeImpacts", "ParentTypeImpactId", "dbo.TypeImpacts");
            DropForeignKey("dbo.EventImpacts", "EventId", "dbo.Events");
            DropIndex("dbo.TypeMitigations", new[] { "ParentTypeMitigationId" });
            DropIndex("dbo.Mitigations", new[] { "TypeMitigationId" });
            DropIndex("dbo.Mitigations", new[] { "EventId" });
            DropIndex("dbo.Mitigations", new[] { "DepartmentId" });
            DropIndex("dbo.Regions", new[] { "RegionTypeId" });
            DropIndex("dbo.Regions", new[] { "ParentRegionId" });
            DropIndex("dbo.EventRegions", new[] { "RegionId" });
            DropIndex("dbo.EventRegions", new[] { "EventId" });
            DropIndex("dbo.TypeImpacts", new[] { "ParentTypeImpactId" });
            DropIndex("dbo.EventImpacts", new[] { "TypeImpactId" });
            DropIndex("dbo.EventImpacts", new[] { "EventId" });
            DropIndex("dbo.Events", new[] { "TypeSourceId" });
            DropIndex("dbo.Events", new[] { "TypeEventId" });
            DropIndex("dbo.DeclaredEvents", new[] { "EventId" });
            DropTable("dbo.TypeMitigations");
            DropTable("dbo.Mitigations");
            DropTable("dbo.Departments");
            DropTable("dbo.TypeSources");
            DropTable("dbo.TypeEvents");
            DropTable("dbo.RegionTypes");
            DropTable("dbo.Regions");
            DropTable("dbo.EventRegions");
            DropTable("dbo.TypeImpacts");
            DropTable("dbo.EventImpacts");
            DropTable("dbo.Events");
            DropTable("dbo.DeclaredEvents");
        }
    }
}
