namespace Database.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlteredDeclaredEvent : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.DeclaredEvents", "DeclaredDate", c => c.DateTime());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.DeclaredEvents", "DeclaredDate", c => c.DateTime(nullable: false));
        }
    }
}
