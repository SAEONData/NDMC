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
    [ODataRoutePrefix("TypeImpacts")]
    [EnableCors("CORSPolicy")]
    public class TypeImpactsController : ODataController
    {
        public SQLDBContext _context { get; }
        public TypeImpactsController(SQLDBContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Get a list of TypeImpact
        /// </summary>
        /// <returns>List of TypeImpact</returns>
        [HttpGet]
        [EnableQuery]
        public IQueryable<TypeImpact> Get()
        {
            return _context.TypeImpacts.AsQueryable();
        }
    }
}
