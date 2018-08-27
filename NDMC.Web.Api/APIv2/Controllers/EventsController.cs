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
    [ODataRoutePrefix("Events")]
    [EnableCors("CORSPolicy")]
    public class EventsController : ODataController
    {
        public SQLDBContext _context { get; }
        public EventsController(SQLDBContext context)
        {
            _context = context;
        }

        [EnableQuery]
        public IQueryable<Event> Get()
        {
            return _context.Events.AsQueryable();
        }

        [EnableQuery]
        [ODataRoute("({id})")]
        public SingleResult<Event> Get(int id)
        {
            return SingleResult.Create(_context.Events.Where(x => x.EventId == id));
        }
    }
}
