namespace Database.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RemovedParentRequirements : DbMigration
    {
        public override void Up()
        {
            DropIndex("dbo.AdminRegions", new[] { "ParentAdminRegion_AdminRegionId" });
            DropIndex("dbo.TypeEvents", new[] { "ParentTypeEvent_TypeEventId" });
            DropIndex("dbo.TypePressures", new[] { "ParentTypePressure_TypePressureId" });
            DropIndex("dbo.TypeStocks", new[] { "ParentTypeStock_TypeStockId" });
            DropIndex("dbo.TypeImpacts", new[] { "ParentTypeImpact_TypeImpactId" });
            DropIndex("dbo.TypeMitigations", new[] { "ParentTypeMitigation_TypeMitigationId" });
            AlterColumn("dbo.AdminRegions", "ParentAdminRegionId", c => c.Int());
            AlterColumn("dbo.AdminRegions", "ParentAdminRegion_AdminRegionId", c => c.Int());
            AlterColumn("dbo.TypeEvents", "ParentTypeEventId", c => c.Int());
            AlterColumn("dbo.TypeEvents", "ParentTypeEvent_TypeEventId", c => c.Int());
            AlterColumn("dbo.TypePressures", "ParentTypePressureId", c => c.Int());
            AlterColumn("dbo.TypePressures", "ParentTypePressure_TypePressureId", c => c.Int());
            AlterColumn("dbo.TypeStocks", "ParentTypeStockId", c => c.Int());
            AlterColumn("dbo.TypeStocks", "ParentTypeStock_TypeStockId", c => c.Int());
            AlterColumn("dbo.TypeImpacts", "ParentTypeImpactId", c => c.Int());
            AlterColumn("dbo.TypeImpacts", "ParentTypeImpact_TypeImpactId", c => c.Int());
            AlterColumn("dbo.TypeMitigations", "ParentTypeMitigationId", c => c.Int());
            AlterColumn("dbo.TypeMitigations", "ParentTypeMitigation_TypeMitigationId", c => c.Int());
            CreateIndex("dbo.AdminRegions", "ParentAdminRegion_AdminRegionId");
            CreateIndex("dbo.TypeEvents", "ParentTypeEvent_TypeEventId");
            CreateIndex("dbo.TypePressures", "ParentTypePressure_TypePressureId");
            CreateIndex("dbo.TypeStocks", "ParentTypeStock_TypeStockId");
            CreateIndex("dbo.TypeImpacts", "ParentTypeImpact_TypeImpactId");
            CreateIndex("dbo.TypeMitigations", "ParentTypeMitigation_TypeMitigationId");
        }
        
        public override void Down()
        {
            DropIndex("dbo.TypeMitigations", new[] { "ParentTypeMitigation_TypeMitigationId" });
            DropIndex("dbo.TypeImpacts", new[] { "ParentTypeImpact_TypeImpactId" });
            DropIndex("dbo.TypeStocks", new[] { "ParentTypeStock_TypeStockId" });
            DropIndex("dbo.TypePressures", new[] { "ParentTypePressure_TypePressureId" });
            DropIndex("dbo.TypeEvents", new[] { "ParentTypeEvent_TypeEventId" });
            DropIndex("dbo.AdminRegions", new[] { "ParentAdminRegion_AdminRegionId" });
            AlterColumn("dbo.TypeMitigations", "ParentTypeMitigation_TypeMitigationId", c => c.Int(nullable: false));
            AlterColumn("dbo.TypeMitigations", "ParentTypeMitigationId", c => c.Int(nullable: false));
            AlterColumn("dbo.TypeImpacts", "ParentTypeImpact_TypeImpactId", c => c.Int(nullable: false));
            AlterColumn("dbo.TypeImpacts", "ParentTypeImpactId", c => c.Int(nullable: false));
            AlterColumn("dbo.TypeStocks", "ParentTypeStock_TypeStockId", c => c.Int(nullable: false));
            AlterColumn("dbo.TypeStocks", "ParentTypeStockId", c => c.Int(nullable: false));
            AlterColumn("dbo.TypePressures", "ParentTypePressure_TypePressureId", c => c.Int(nullable: false));
            AlterColumn("dbo.TypePressures", "ParentTypePressureId", c => c.Int(nullable: false));
            AlterColumn("dbo.TypeEvents", "ParentTypeEvent_TypeEventId", c => c.Int(nullable: false));
            AlterColumn("dbo.TypeEvents", "ParentTypeEventId", c => c.Int(nullable: false));
            AlterColumn("dbo.AdminRegions", "ParentAdminRegion_AdminRegionId", c => c.Int(nullable: false));
            AlterColumn("dbo.AdminRegions", "ParentAdminRegionId", c => c.Int(nullable: false));
            CreateIndex("dbo.TypeMitigations", "ParentTypeMitigation_TypeMitigationId");
            CreateIndex("dbo.TypeImpacts", "ParentTypeImpact_TypeImpactId");
            CreateIndex("dbo.TypeStocks", "ParentTypeStock_TypeStockId");
            CreateIndex("dbo.TypePressures", "ParentTypePressure_TypePressureId");
            CreateIndex("dbo.TypeEvents", "ParentTypeEvent_TypeEventId");
            CreateIndex("dbo.AdminRegions", "ParentAdminRegion_AdminRegionId");
        }
    }
}
