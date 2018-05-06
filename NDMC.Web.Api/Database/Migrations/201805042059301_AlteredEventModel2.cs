namespace Database.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlteredEventModel2 : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Events", "StartDate", c => c.DateTime());
            AlterColumn("dbo.Events", "EndDate", c => c.DateTime());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Events", "EndDate", c => c.DateTime(nullable: false));
            AlterColumn("dbo.Events", "StartDate", c => c.DateTime(nullable: false));
        }
    }
}
