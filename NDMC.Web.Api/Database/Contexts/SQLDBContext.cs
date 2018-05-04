using Database.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Database.Contexts
{
    public class SQLDBContext : DbContext
    {
        public DbSet<AdminRegion> AdminRegions { get; set; }
        public DbSet<Declaration> Declarations { get; set; }
        public DbSet<DeclarationRegion> DeclarationRegions { get; set; }
        public DbSet<DeclaredEvent> DeclaredEvents { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<EventImpact> EventImpacts { get; set; }
        public DbSet<Mitigation> Mitigations { get; set; }
        public DbSet<Stakeholder> Stakeholders { get; set; }
        public DbSet<TypeEvent> TypeEvents { get; set; }
        public DbSet<TypeImpact> TypeImpacts { get; set; }
        public DbSet<TypeMitigation> TypeMitigations { get; set; }
        public DbSet<TypePressure> TypePressures { get; set; }
        public DbSet<TypeSource> TypeSources { get; set; }
        public DbSet<TypeStock> TypeStocks { get; set; }

        private readonly string connectionString;

        public SQLDBContext()
        {
            this.connectionString = "DefaultConnection";
        }

        public SQLDBContext(string connectionString) : base()
        {
            this.connectionString = connectionString;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                //optionsBuilder.UseSqlServer(connectionString);
            }
        }
    }
}
