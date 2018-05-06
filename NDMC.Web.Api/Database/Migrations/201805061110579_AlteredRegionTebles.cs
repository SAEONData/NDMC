namespace Database.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlteredRegionTebles : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.RegionTypes",
                c => new
                    {
                        RegionTypeId = c.Int(nullable: false, identity: true),
                        RegionTypeName = c.String(),
                    })
                .PrimaryKey(t => t.RegionTypeId);
            
            AddColumn("dbo.Regions", "RegionTypeId", c => c.Int());
            CreateIndex("dbo.Regions", "RegionTypeId");
            AddForeignKey("dbo.Regions", "RegionTypeId", "dbo.RegionTypes", "RegionTypeId");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Regions", "RegionTypeId", "dbo.RegionTypes");
            DropIndex("dbo.Regions", new[] { "RegionTypeId" });
            DropColumn("dbo.Regions", "RegionTypeId");
            DropTable("dbo.RegionTypes");
        }
    }
}
