using APIv2.Database.Contexts;
using APIv2.Database.Models;

using Microsoft.AspNet.OData;
using Microsoft.AspNet.OData.Routing;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace APIv2.Controllers
{
    [Produces("application/json")]
    [ODataRoutePrefix("TypeSource")]
    [EnableCors("CORSPolicy")]
    public class TypeSourcesController : ODataController
    {
        public SQLDBContext _context { get; }
        public TypeSourcesController(SQLDBContext context)
        {
            _context = context;
        }

        [EnableQuery]
        public IQueryable<TypeSource> Get()
        {
            return _context.TypeSources.AsQueryable();
        }
    }
}
