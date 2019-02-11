using APIv2.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace APIv2.Database.Contexts
{
    public class SQLDBContext : DbContext
    {
        public DbSet<DeclaredEvent> DeclaredEvents { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<EventRegion> EventRegions { get; set; }
        public DbSet<EventImpact> EventImpacts { get; set; }
        public DbSet<Mitigation> Mitigations { get; set; }
        public DbSet<TypeImpact> TypeImpacts { get; set; }
        public DbSet<TypeMitigation> TypeMitigations { get; set; }
        public DbSet<TypeSource> TypeSources { get; set; }

        public SQLDBContext() : base() { }

        public SQLDBContext(DbContextOptions options) : base(options) { }
    }
}
