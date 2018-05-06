namespace Database.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class UpdatedColumns : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.TypeEvents", "TypePressureId", "dbo.TypePressures");
            DropForeignKey("dbo.TypeEvents", "TypeStockId", "dbo.TypeStocks");
            DropIndex("dbo.TypeEvents", new[] { "TypePressureId" });
            DropIndex("dbo.TypeEvents", new[] { "TypeStockId" });
            AddColumn("dbo.DeclaredEvents", "DeclaredDate", c => c.DateTime(nullable: false));
            AddColumn("dbo.TypeImpacts", "UnitOfMeasure", c => c.String());
            AddColumn("dbo.TypeMitigations", "UnitOfMeasure", c => c.String());
            AlterColumn("dbo.TypeEvents", "TypePressureId", c => c.Int());
            AlterColumn("dbo.TypeEvents", "TypeStockId", c => c.Int());
            AlterColumn("dbo.Mitigations", "Value", c => c.Double(nullable: false));
            CreateIndex("dbo.TypeEvents", "TypePressureId");
            CreateIndex("dbo.TypeEvents", "TypeStockId");
            AddForeignKey("dbo.TypeEvents", "TypePressureId", "dbo.TypePressures", "TypePressureId");
            AddForeignKey("dbo.TypeEvents", "TypeStockId", "dbo.TypeStocks", "TypeStockId");
            DropColumn("dbo.DeclaredEvents", "Declared");
            DropColumn("dbo.Events", "EventName");
            DropColumn("dbo.EventImpacts", "UnitOfMeasure");
        }
        
        public override void Down()
        {
            AddColumn("dbo.EventImpacts", "UnitOfMeasure", c => c.String(nullable: false));
            AddColumn("dbo.Events", "EventName", c => c.String(nullable: false));
            AddColumn("dbo.DeclaredEvents", "Declared", c => c.DateTime(nullable: false));
            DropForeignKey("dbo.TypeEvents", "TypeStockId", "dbo.TypeStocks");
            DropForeignKey("dbo.TypeEvents", "TypePressureId", "dbo.TypePressures");
            DropIndex("dbo.TypeEvents", new[] { "TypeStockId" });
            DropIndex("dbo.TypeEvents", new[] { "TypePressureId" });
            AlterColumn("dbo.Mitigations", "Value", c => c.String(nullable: false));
            AlterColumn("dbo.TypeEvents", "TypeStockId", c => c.Int(nullable: false));
            AlterColumn("dbo.TypeEvents", "TypePressureId", c => c.Int(nullable: false));
            DropColumn("dbo.TypeMitigations", "UnitOfMeasure");
            DropColumn("dbo.TypeImpacts", "UnitOfMeasure");
            DropColumn("dbo.DeclaredEvents", "DeclaredDate");
            CreateIndex("dbo.TypeEvents", "TypeStockId");
            CreateIndex("dbo.TypeEvents", "TypePressureId");
            AddForeignKey("dbo.TypeEvents", "TypeStockId", "dbo.TypeStocks", "TypeStockId", cascadeDelete: true);
            AddForeignKey("dbo.TypeEvents", "TypePressureId", "dbo.TypePressures", "TypePressureId", cascadeDelete: true);
        }
    }
}
