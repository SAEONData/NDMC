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
    [ODataRoutePrefix("DeclaredEvents")]
    [EnableCors("CORSPolicy")]
    public class DeclaredEventsController : ODataController
    {
        public SQLDBContext _context { get; }
        public DeclaredEventsController(SQLDBContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Get a list of DeclaredEvent
        /// </summary>
        /// <returns>List of DeclaredEvent</returns>
        [HttpGet]
        [EnableQuery]
        public IQueryable<DeclaredEvent> Get()
        {
            return _context.DeclaredEvents.AsQueryable();
        }
    }
}
