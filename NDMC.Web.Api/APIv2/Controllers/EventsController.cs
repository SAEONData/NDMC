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

        [EnableQuery(MaxExpansionDepth = 0)]
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

        [HttpGet]
        [EnableQuery]
        public JsonResult GeoJson()
        {
            var eventImpacts = _context.EventImpacts.ToArray();

            var geoJSON = _context.Events
                .Select(e => new
                {
                    type = "Feature",
                    properties = new
                    {
                        id = e.EventId,
                        regions = e.EventRegions.Select(er => er.RegionId).ToArray(),
                        hazard = e.TypeEventId,
                        startDate = ConvertToDateString(e.StartDate),
                        endDate = ConvertToDateString(e.EndDate),
                        declaredDates = e.DeclaredEvents.Select(de => ConvertToDateString(de.DeclaredDate)).ToArray(),
                        impacts = GetEventImpacts(e.EventRegions.Select(er => er.EventRegionId).ToArray(), eventImpacts)
                    }
                })
                .Distinct()
                .Where(x => x.properties.impacts.Length > 0)
                .ToList();

            return new JsonResult(geoJSON);
        }

        private int[] GetEventImpacts(int[] eventRegionIDs, EventImpact[] eventImpacts)
        {
            var eventImpactIDs = new List<int>();

            foreach (var erID in eventRegionIDs)
            {
                eventImpactIDs.AddRange(
                    eventImpacts
                    .Where(ei => ei.EventRegionId == erID)
                    .Select(ei => ei.EventImpactId)
                    .ToArray()
                );
            }

            return eventImpactIDs.Distinct().OrderBy(ei => ei).ToArray();
        }

        private string ConvertToDateString(long? unixTime)
        {
            if (unixTime == null)
            {
                var dt = DateTime.Now;
                unixTime = ((DateTimeOffset)dt).ToUnixTimeSeconds();
            }
            long _unixTime = (long)unixTime;

            // Unix timestamp is seconds past epoch
            return DateTimeOffset.FromUnixTimeSeconds(_unixTime).Date.ToString("yyyy-MM-dd");
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
