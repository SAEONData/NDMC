using APIv2.Database.Models;
using APIv2.ViewModels;

using Microsoft.AspNet.OData.Builder;
using Microsoft.OData.Edm;

using System;

namespace APIv2.Database.Contexts
{
    public class CustomODataModelBuilder
    {
        public IEdmModel GetEdmModel(IServiceProvider serviceProvider)
        {
            var builder = new ODataConventionModelBuilder(serviceProvider);
            int maxExpandDepth = 0;

            builder.EntitySet<Event>("Events")
                .EntityType
                .Filter() // Allow for the $filter Command
                .Count() // Allow for the $count Command
                .Expand(maxExpandDepth) // Allow for the $expand Command
                .OrderBy() // Allow for the $orderby Command
                .Page() // Allow for the $top and $skip Commands
                .Select();// Allow for the $select Command; 

            builder.EntitySet<Region>("Regions")
                .EntityType
                .Filter()
                .Count()
                .Expand(maxExpandDepth)
                .OrderBy()
                .Page()
                .Select();

            builder.EntitySet<EventRegion>("EventRegions")
                .EntityType
                .Filter()
                .Count()
                .Expand(maxExpandDepth)
                .OrderBy()
                .Page()
                .Select();

            builder.EntitySet<RegionType>("RegionTypes")
                .EntityType
                .Filter()
                .Count()
                .Expand(maxExpandDepth)
                .OrderBy()
                .Page()
                .Select();

            builder.EntitySet<DeclaredEvent>("DeclaredEvents")
                .EntityType
                .Filter()
                .Count()
                .Expand(maxExpandDepth)
                .OrderBy()
                .Page()
                .Select();

            builder.EntitySet<EventImpact>("EventImpacts")
                .EntityType
                .Filter()
                .Count()
                .Expand(maxExpandDepth)
                .OrderBy()
                .Page()
                .Select();

            builder.EntitySet<TypeEvent>("TypeEvents")
                .EntityType
                .Filter()
                .Count()
                .Expand(maxExpandDepth)
                .OrderBy()
                .Page()
                .Select();

            builder.EntitySet<TypeImpact>("TypeImpacts")
                .EntityType
                .Filter()
                .Count()
                .Expand(maxExpandDepth)
                .OrderBy()
                .Page()
                .Select();

            builder.EntitySet<TypeMitigation>("TypeMitigations")
                .EntityType
                .Filter()
                .Count()
                .Expand(maxExpandDepth)
                .OrderBy()
                .Page()
                .Select();

            builder.EntitySet<TypeSource>("TypeSources")
                .EntityType
                .Filter()
                .Count()
                .Expand(maxExpandDepth)
                .OrderBy()
                .Page()
                .Select();

            builder.EntitySet<Mitigation>("Mitigations")
                .EntityType
                .Filter()
                .Count()
                .Expand(maxExpandDepth)
                .OrderBy()
                .Page()
                .Select();

            builder.Namespace = "Extensions";
            builder.EntityType<Event>()
                .Collection
                .Action("Filter")
                .ReturnsCollectionViaEntitySetPath<Event>("bindingParameter")
                .Parameter<Filters>("filters");

            return builder.GetEdmModel();
        }
    }
}
