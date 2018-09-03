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
    [ODataRoutePrefix("TypeMitigation")]
    [EnableCors("CORSPolicy")]
    public class TypeMitigationsController : ODataController
    {
        public SQLDBContext _context { get; }
        public TypeMitigationsController(SQLDBContext context)
        {
            _context = context;
        }

        [EnableQuery]
        public IQueryable<TypeMitigation> Get()
        {
            return _context.TypeMitigations.AsQueryable();
        }
    }
}
