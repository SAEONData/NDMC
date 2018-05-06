namespace Database.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class FixedFKIssues : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.TypeImpacts", "ParentTypeImpactId");
            DropColumn("dbo.Regions", "ParentRegionId");
            DropColumn("dbo.TypeMitigations", "ParentTypeMitigationId");
            RenameColumn(table: "dbo.TypeImpacts", name: "ParentTypeImpact_TypeImpactId", newName: "ParentTypeImpactId");
            RenameColumn(table: "dbo.Regions", name: "ParentRegion_RegionId", newName: "ParentRegionId");
            RenameColumn(table: "dbo.TypeMitigations", name: "ParentTypeMitigation_TypeMitigationId", newName: "ParentTypeMitigationId");
            RenameIndex(table: "dbo.TypeImpacts", name: "IX_ParentTypeImpact_TypeImpactId", newName: "IX_ParentTypeImpactId");
            RenameIndex(table: "dbo.Regions", name: "IX_ParentRegion_RegionId", newName: "IX_ParentRegionId");
            RenameIndex(table: "dbo.TypeMitigations", name: "IX_ParentTypeMitigation_TypeMitigationId", newName: "IX_ParentTypeMitigationId");
        }
        
        public override void Down()
        {
            RenameIndex(table: "dbo.TypeMitigations", name: "IX_ParentTypeMitigationId", newName: "IX_ParentTypeMitigation_TypeMitigationId");
            RenameIndex(table: "dbo.Regions", name: "IX_ParentRegionId", newName: "IX_ParentRegion_RegionId");
            RenameIndex(table: "dbo.TypeImpacts", name: "IX_ParentTypeImpactId", newName: "IX_ParentTypeImpact_TypeImpactId");
            RenameColumn(table: "dbo.TypeMitigations", name: "ParentTypeMitigationId", newName: "ParentTypeMitigation_TypeMitigationId");
            RenameColumn(table: "dbo.Regions", name: "ParentRegionId", newName: "ParentRegion_RegionId");
            RenameColumn(table: "dbo.TypeImpacts", name: "ParentTypeImpactId", newName: "ParentTypeImpact_TypeImpactId");
            AddColumn("dbo.TypeMitigations", "ParentTypeMitigationId", c => c.Int());
            AddColumn("dbo.Regions", "ParentRegionId", c => c.Int());
            AddColumn("dbo.TypeImpacts", "ParentTypeImpactId", c => c.Int());
        }
    }
}
