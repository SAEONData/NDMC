namespace Database.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlteredEventImpact : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.EventImpacts", "Measure", c => c.Double());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.EventImpacts", "Measure", c => c.Int(nullable: false));
        }
    }
}
