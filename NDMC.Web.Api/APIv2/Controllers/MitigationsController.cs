using APIv2.Database.Contexts;
using APIv2.Database.Models;

using Microsoft.AspNet.OData;
using Microsoft.AspNet.OData.Routing;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace APIv2.Controllers
{
    [Produces("application/json")]
    [ODataRoutePrefix("Mitigations")]
    [EnableCors("CORSPolicy")]
    public class MitigationsController : ODataController
    {
        public SQLDBContext _context { get; }
        public MitigationsController(SQLDBContext context)
        {
            _context = context;
        }

        [EnableQuery]
        public IQueryable<Mitigation> Get()
        {
            return _context.Mitigations.AsQueryable();
        }

        [EnableQuery]
        [ODataRoute("({id})")]
        public SingleResult<Mitigation> Get(int id)
        {
            return SingleResult.Create(_context.Mitigations.Where(x => x.EventId == id));
        }
    }
}