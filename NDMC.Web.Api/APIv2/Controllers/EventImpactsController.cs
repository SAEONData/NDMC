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
    [ODataRoutePrefix("EventImpact")]
    [EnableCors("CORSPolicy")]
    public class EventImpactsController : ODataController
    {
        public SQLDBContext _context { get; }
        public EventImpactsController(SQLDBContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Get a list of EventImpact
        /// </summary>
        /// <returns>List of EventImpact</returns>
        [HttpGet]
        [EnableQuery]
        public IQueryable<EventImpact> Get()
        {
            return _context.EventImpacts.AsQueryable();
        }
    }
}
