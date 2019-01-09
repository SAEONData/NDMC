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
    [ODataRoutePrefix("EventRegion")]
    [EnableCors("CORSPolicy")]
    public class EventRegionsController : ODataController
    {
        public SQLDBContext _context { get; }
        public EventRegionsController(SQLDBContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Get a list of EventRegion
        /// </summary>
        /// <returns>List of EventRegion</returns>
        [HttpGet]
        [EnableQuery]
        public IQueryable<EventRegion> Get()
        {
            return _context.EventRegions.AsQueryable();
        }
    }
}
