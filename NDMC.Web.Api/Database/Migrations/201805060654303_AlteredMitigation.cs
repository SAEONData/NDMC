namespace Database.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlteredMitigation : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Mitigations", "Date", c => c.DateTime());
            AlterColumn("dbo.Mitigations", "Value", c => c.Double());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Mitigations", "Value", c => c.Double(nullable: false));
            AlterColumn("dbo.Mitigations", "Date", c => c.DateTime(nullable: false));
        }
    }
}
