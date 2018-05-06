using Database.Migrations;
using Database.Models;
using System.Data.Entity;

namespace Database.Contexts
{
    public class SQLDBContext : DbContext
    {
        public DbSet<Region> Regions { get; set; }
        public DbSet<RegionType> RegionTypes { get; set; }
        public DbSet<DeclaredEvent> DeclaredEvents { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<EventRegion> EventRegions { get; set; }
        public DbSet<EventImpact> EventImpacts { get; set; }
        public DbSet<Mitigation> Mitigations { get; set; }
        public DbSet<TypeEvent> TypeEvents { get; set; }
        public DbSet<TypeImpact> TypeImpacts { get; set; }
        public DbSet<TypeMitigation> TypeMitigations { get; set; }
        public DbSet<TypeSource> TypeSources { get; set; }
        //public DbSet<Declaration> Declarations { get; set; }
        //public DbSet<DeclarationRegion> DeclarationRegions { get; set; }
        //public DbSet<Stakeholder> Stakeholders { get; set; }
        //public DbSet<TypeStock> TypeStocks { get; set; }
        //public DbSet<TypePressure> TypePressures { get; set; }

        public SQLDBContext() : base("DefaultConnection")
        {
            System.Data.Entity.Database.SetInitializer(new MigrateDatabaseToLatestVersion<SQLDBContext, Configuration>());
        }

        public SQLDBContext(string connectionString) : base(connectionString)
        {
            System.Data.Entity.Database.SetInitializer(new MigrateDatabaseToLatestVersion<SQLDBContext, Configuration>());
        }
    }
}
