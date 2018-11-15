using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using APIv2.Database.Contexts;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.AspNet.OData.Extensions;
using Microsoft.AspNet.OData.Formatter;
using Microsoft.AspNet.OData.Builder;
using Microsoft.AspNetCore.Builder;
using Microsoft.OData.Edm;

namespace APIv2
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("CORSPolicy",
                      builder =>
                      {
                          builder.WithOrigins("http://localhost:8080", "http://localhost:8091", "http://app01.saeon.ac.za/ndmcsite")
                                 .AllowAnyHeader()
                                 .AllowAnyMethod();
                      });
            });

            var connectionString = Configuration.GetConnectionString("NDMC");
            services.AddDbContext<SQLDBContext>(options =>
            {
                options.UseSqlServer(connectionString, o => {
                    o.UseRowNumberForPaging(); //Backwards compatibility for SQL 2008 R2
                });
            });

            services.AddTransient<CustomODataModelBuilder>();

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
            services.AddOData();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, CustomODataModelBuilder modelBuilder)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            app.UseCors("CORSPolicy");

            app.UseHttpsRedirection();

            //app.UseMvc();
            app.UseMvc(routeBuilder =>
            {
                routeBuilder.MapODataServiceRoute(
                    "ODataRoutes",
                    "odata",
                    modelBuilder.GetEdmModel(app.ApplicationServices));
            });
        }
    }
}
