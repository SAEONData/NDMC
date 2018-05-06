namespace Database.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlteredEventModel : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Events", "TypeEventId", "dbo.TypeEvents");
            DropForeignKey("dbo.Events", "TypeSourceId", "dbo.TypeSources");
            DropIndex("dbo.Events", new[] { "TypeEventId" });
            DropIndex("dbo.Events", new[] { "TypeSourceId" });
            AlterColumn("dbo.Events", "TypeEventId", c => c.Int());
            AlterColumn("dbo.Events", "TypeSourceId", c => c.Int());
            CreateIndex("dbo.Events", "TypeEventId");
            CreateIndex("dbo.Events", "TypeSourceId");
            AddForeignKey("dbo.Events", "TypeEventId", "dbo.TypeEvents", "TypeEventId");
            AddForeignKey("dbo.Events", "TypeSourceId", "dbo.TypeSources", "TypeSourceId");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Events", "TypeSourceId", "dbo.TypeSources");
            DropForeignKey("dbo.Events", "TypeEventId", "dbo.TypeEvents");
            DropIndex("dbo.Events", new[] { "TypeSourceId" });
            DropIndex("dbo.Events", new[] { "TypeEventId" });
            AlterColumn("dbo.Events", "TypeSourceId", c => c.Int(nullable: false));
            AlterColumn("dbo.Events", "TypeEventId", c => c.Int(nullable: false));
            CreateIndex("dbo.Events", "TypeSourceId");
            CreateIndex("dbo.Events", "TypeEventId");
            AddForeignKey("dbo.Events", "TypeSourceId", "dbo.TypeSources", "TypeSourceId", cascadeDelete: true);
            AddForeignKey("dbo.Events", "TypeEventId", "dbo.TypeEvents", "TypeEventId", cascadeDelete: true);
        }
    }
}
