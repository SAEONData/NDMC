namespace Database.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AlteredTypeSource : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.TypeSources", "TypeSourceSource", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.TypeSources", "TypeSourceSource");
        }
    }
}
