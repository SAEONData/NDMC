using APIv2.Database.Contexts;
using APIv2.Database.Models;
using APIv2.ViewModels;

using Microsoft.AspNet.OData;
using Microsoft.AspNet.OData.Routing;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

using Microsoft.EntityFrameworkCore;

using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
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

        [HttpPost]
        [EnableQuery]
        public IQueryable<Event> Filter([FromBody] Filters filters)
        {
            int regionFilter = filters.region;
            int startDateFilter = filters.startDate;
            int endDateFIlter = filters.endDate;
            int impactFilter = filters.impact;
            int hazardFilter = filters.hazard;
            int batchSize = filters.batchSize;

            // Region
            var regionEventIds = new List<int>();
            if (regionFilter > 0)
            {
                var allRegionIds = GetChildRegions(regionFilter, _context.Regions.ToList()).Select(region => region.RegionId).Distinct().ToList();
                allRegionIds.Add(regionFilter);

                regionEventIds = _context.EventRegions.Where(p => allRegionIds.Contains(p.RegionId)).Select(p => p.EventId).Distinct().ToList();
            }

            // Hazard

            var events = _context.Events.Include(x => x.TypeEvent).Where(e =>
            (regionFilter == 0 || regionEventIds.Contains(e.EventId)) &&
            (hazardFilter == 0 || e.TypeEventId == hazardFilter) &&
            (startDateFilter == 0 || e.StartDate == startDateFilter) &&
            (endDateFIlter == 0 || e.EndDate == endDateFIlter)
            );


            return events;
        }

        private List<Region> GetChildRegions(int regionId, List<Region> regionList)
        {
            var regions = regionList.Where(x => x.ParentRegionId == regionId).ToList();

            var childRegions = new List<Region>();
            foreach (var region in regions)
            {
                childRegions.AddRange(GetChildRegions(region.RegionId, regionList));
            }
            regions.AddRange(childRegions);

            return regions;
        }
    }
}
