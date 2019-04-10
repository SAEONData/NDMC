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
using Swashbuckle.AspNetCore.Swagger;

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
                          builder
                            .AllowAnyOrigin()
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

            // Add OpenAPI/Swagger document
            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new Info
                {
                    Title = "NHE API",
                    Version = "v1.0-beta",
                    Description = "This API gives you access to all <b>NHE <i>(National Hazardous Events Database)</i></b> data. <br/>" +
                    "Read access is unauthenticated, but some write actions require authentication <i>(look out for the lock icon)</i>",
                    Contact = new Contact() { Name = "Contact Us", Url = "http://app01.saeon.ac.za/dev/UI_footside/page_contact.html" },
                    License = new License() { Name = "Data Licences", Url = "https://docs.google.com/document/d/e/2PACX-1vT8ajcogJEEo0ZC9BGIej_jOH2EV8lMFrwOu8LB4K9pDq7Tki94mUoVxU8hGM-J5EL8V3w5o83_TuEl/pub" },
                    TermsOfService = "http://noframe.media.dirisa.org/wiki-1/conditions-of-use?searchterm=conditions"
                });
                options.DocumentFilter<CustomDocumentFilter>();
            });
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

            // Add OpenAPI/Swagger middlewares
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("v1/swagger.json", "v1.0-beta");
            });

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
