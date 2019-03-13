using APIv2.Database.Contexts;
using APIv2.Database.Models;
using APIv2.Extensions;
using APIv2.ViewModels;

using Microsoft.AspNet.OData;
using Microsoft.AspNet.OData.Routing;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Drawing;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace APIv2.Controllers
{
    [Produces("application/json")]
    [ODataRoutePrefix("Events")]
    [EnableCors("CORSPolicy")]
    public class EventsController : ODataController
    {
        public SQLDBContext _context { get; }
        IConfiguration _config { get; }

        public EventsController(SQLDBContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        /// <summary>
        /// Get a list of Event
        /// </summary>
        /// <returns>List of Event</returns>
        [HttpGet]
        [EnableQuery(MaxExpansionDepth = 0)]
        public IQueryable<Event> Get()
        {
            return _context.Events.AsQueryable();
        }

        /// <summary>
        /// Get a specific Event by id
        /// </summary>
        /// <param name="id">EventId</param>
        /// <returns>Specific Event by id</returns>
        [HttpGet]
        [EnableQuery]
        [ODataRoute("({id})")]
        public Event Get(int id)
        {
            return _context.Events.FirstOrDefault(x => x.EventId == id);
        }

        /// <summary>
        /// Add/Update an Event
        /// </summary>
        /// <param name="newEvent">Event to add/update</param>
        /// <returns>Success/Fail status</returns>
        [HttpPost]
        //[Authorize(Roles = "Contributor,Custodian,Configurator,SysAdmin")]
        [EnableQuery]
        public async Task<IActionResult> Post([FromBody]Event newEvent)
        {
            Console.WriteLine(newEvent);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var exiting = _context.Events.FirstOrDefault(x => x.EventId == newEvent.EventId);
            if (exiting == null)
            {
                _context.Events.Add(newEvent);
                await _context.SaveChangesAsync();
                return Created(newEvent);
            }
            return Ok(newEvent);
        }

        /// <summary>
        /// Get a filtered list of Event
        /// </summary>
        /// <param name="filters">Composite object containing filters</param>
        /// <returns>Filtered list of Event</returns>
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
            string favsFilter = filters.favorites;

            //FAVORITES - OVERRIDES ALL OTHER FILTERS//
            if (!string.IsNullOrEmpty(favsFilter))
            {
                try
                {
                    var favs = favsFilter.Split(",").Select(f => int.Parse(f)).ToList();
                    return _context.Events.Where(e => favs.Contains(e.EventId));
                }
                catch
                {
                    return new List<Event>().AsQueryable();
                }
            }

            // Region
            var regionEventIds = new List<int>();
            if (regionFilter > 0)
            {
                //Get all RegionIds (including children)
                var allRegionIDs = GetChildren(regionFilter, GetVMSData("regions/flat").Result).Select(r => r).Distinct().ToList();
                allRegionIDs.Add(regionFilter);

                //Get all ProjectIds assigned to these Regions and/or Typology
                regionEventIds = _context.EventRegions.Where(p => allRegionIDs.Contains(p.RegionId)).Select(p => p.EventId).Distinct().ToList();
            }

            // Hazard
            var hazardEventIds = new List<int>();
            if (hazardFilter > 0)
            {
                //Get all HazardIds (including children)
                var allHazardIDs = GetChildren(hazardFilter, GetVMSData("hazards/flat").Result).Select(r => r).Distinct().ToList();
                allHazardIDs.Add(hazardFilter);

                //Get all ProjectIds assigned to these Hazards and/or Typology
                hazardEventIds = _context.Events.Where(e => allHazardIDs.Contains(e.TypeEventId == null ? 0 : (int)e.TypeEventId)).Select(e => e.EventId).Distinct().ToList();
            }

            var impactEventIds = new List<int>();
            if (impactFilter > 0)
            {
                impactEventIds = _context.EventImpacts
                    .Where(ei => ei.TypeImpactId == impactFilter)
                    .Select(ei => ei.EventRegion.EventId)
                    .Distinct()
                    .ToList();
            }

            var events = _context
                .Events
                .Where(e =>
                    (regionFilter == 0 || regionEventIds.Contains(e.EventId)) &&
                    (hazardFilter == 0 || hazardEventIds.Contains(e.EventId)) && //e.TypeEventId == hazardFilter) &&
                    (impactFilter == 0 || impactEventIds.Contains(e.EventId)) &&
                    (startDateFilter == 0 || e.StartDate >= startDateFilter) &&
                    (endDateFIlter == 0 || e.EndDate <= endDateFIlter)
                );


            return events;
        }

        /// <summary>
        /// Get a list of Event in GeoJSON format
        /// </summary>
        /// <returns>List of Event in GeoJSON format</returns>
        [HttpGet]
        [EnableQuery]
        public JsonResult GeoJson()
        {
            var eventImpacts = _context.EventImpacts.ToArray();
            var vmsRegions = GetVMSData("regions/flat").Result;
            var vmsHazards = GetVMSData("hazards/flat").Result;

            var geoJSON = _context.Events
                .Include(e => e.EventRegions)
                .Select(e => new
                {
                    type = "Feature",
                    geometry = new
                    {
                        type = GetWKTType(e.EventRegions, vmsRegions), //e.EventRegions.Count() > 1 ? "MultiPolygon" : "Polygon",
                        coordinates = GetCoordinates(e.EventRegions, vmsRegions)
                    },
                    properties = new
                    {
                        id = e.EventId,
                        regions = GetGeoProps(e.EventRegions.Select(er => er.RegionId).ToArray(), vmsRegions),
                        hazard = e.TypeEventId,
                        hazardName = vmsHazards.FirstOrDefault(x => int.Parse(x.Id) == e.TypeEventId).Value,
                        startDate = ConvertToDateString(e.StartDate),
                        endDate = ConvertToDateString(e.EndDate),
                        declaredDates = e.DeclaredEvents.Select(de => ConvertToDateString(de.DeclaredDate)).ToArray(),
                        impacts = GetEventImpacts(e.EventRegions.Select(er => er.EventRegionId).ToArray(), eventImpacts)
                    }
                })
                .Distinct()
                //.Where(x => x.properties.impacts.Length > 0)
                .ToList();

            return new JsonResult(geoJSON);
        }

        private string GetWKTType(ICollection<EventRegion> eventRegions, List<StandardVocabItem> vmsRegions)
        {
            string type = "Polygon";

            if (eventRegions.Count() == 1)
            {
                var vmsRegion = vmsRegions.FirstOrDefault(v => v.Id == eventRegions.First().RegionId.ToString());
                if (vmsRegion != null)
                {
                    var simpleWKT = vmsRegion.AdditionalData.FirstOrDefault(ad => ad.Key == "SimpleWKT");
                    if (!string.IsNullOrEmpty(simpleWKT.Value))
                    {
                        type = WKTConvert.GetWKTType(simpleWKT.Value).ToString();
                    }
                }
            }
            else if (eventRegions.Count() > 1)
            {
                type = "MultiPolygon";
            }

            return type;
        }

        private object[] GetCoordinates(ICollection<EventRegion> eventRegions, List<StandardVocabItem> vmsRegions)
        {
            var result = new List<object>();

            foreach (var er in eventRegions)
            {
                //var polygon = new List<object>();

                var vmsRegion = vmsRegions.FirstOrDefault(v => v.Id == er.RegionId.ToString());
                if (vmsRegion != null)
                {
                    var simpleWKT = vmsRegion.AdditionalData.FirstOrDefault(ad => ad.Key == "SimpleWKT");
                    if (!string.IsNullOrEmpty(simpleWKT.Value))
                    {
                        //var parsedWKT = simpleWKT.Value.Replace("POLYGON((", "").Replace("))", "");

                        //foreach (var point in parsedWKT.Split(","))
                        //{
                        //    var pointValues = point.Trim().Split(" ");
                        //    if (pointValues.Length == 2)
                        //    {
                        //        if (double.TryParse(pointValues[0].Trim(), out double pointLat) &&
                        //            double.TryParse(pointValues[1].Trim(), out double pointLon))
                        //        {
                        //            var polyPoint = new double[] { pointLat, pointLon };
                        //            polygon.Add(polyPoint);
                        //        }
                        //    }
                        //}

                        //Extract polygon data
                        var WKTPolygons = WKTConvert.GetPolygons(simpleWKT.Value);
                        foreach (var poly in WKTPolygons)
                        {
                            var polygon = new List<object>();

                            //Convert points
                            foreach (var point in poly.WKTPoints)
                            {
                                var polyPoint = new double[] { point.Lat, point.Lng };
                                polygon.Add(polyPoint);
                            }

                            //Add result if relevant
                            if (polygon.Count > 0)
                            {
                                result.Add(polygon);
                            }
                        }
                    }
                }

                //result.Add(polygon);
            }

            return result.ToArray();
        }

        private int[] GetEventImpacts(int[] eventRegionIDs, EventImpact[] eventImpacts)
        {
            var eventImpactIDs = new List<int>();

            foreach (var erID in eventRegionIDs)
            {
                eventImpactIDs.AddRange(
                    eventImpacts
                    .Where(ei => ei.EventRegionId == erID)
                    .Select(ei => ei.TypeImpactId)
                    .ToArray()
                );
            }

            return eventImpactIDs.Distinct().OrderBy(ei => ei).ToArray();
        }

        private string ConvertToDateString(long? unixTime)
        {
            long _unixTime = unixTime != null ? (long)unixTime : 0;

            // Unix timestamp is seconds past epoch
            return DateTimeOffset.FromUnixTimeSeconds(_unixTime).Date.ToString("yyyy-MM-dd");
        }

        private async Task<List<StandardVocabItem>> GetVMSData(string relativeURL)
        {
            var result = new StandardVocabOutput();

            //Setup http-client
            var client = new HttpClient();
            client.BaseAddress = new Uri(_config.GetValue<string>("VmsApiBaseUrl"));
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            //Get data from VMS API
            var response = await client.GetAsync(relativeURL);
            if (response != null)
            {
                var jsonString = await response.Content.ReadAsStringAsync();
                result = JsonConvert.DeserializeObject<StandardVocabOutput>(jsonString);
            }

            return result.Items;
        }

        private List<int> GetChildren(int filterID, List<StandardVocabItem> data)
        {
            var children = data
                .Where(x =>
                    x.AdditionalData.Any(y => y.Key == "ParentId" && y.Value == filterID.ToString())
                )
                .Select(x => int.Parse(x.Id))
                .ToList();

            var addChildren = new List<int>();
            foreach (var child in children)
            {
                //Add to temp list so as to not modify 'children' during iteration
                addChildren.AddRange(GetChildren(child, data));
            }
            //Transfer to actual list
            children.AddRange(addChildren);

            return children;
        }

        private List<int> GetParents(int filterID, List<StandardVocabItem> data)
        {
            var parentId = "";

            //Get ParentId
            var vmsItem = data.FirstOrDefault(x => x.Id == filterID.ToString());
            if (vmsItem != null)
            {
                var addItem = vmsItem.AdditionalData.FirstOrDefault(x => x.Key == "ParentId");
                if (!string.IsNullOrEmpty(addItem.Value))
                {
                    parentId = addItem.Value;
                }
            }

            var parents = data
                .Where(x =>
                    x.Id == parentId
                )
                .Select(x => int.Parse(x.Id))
                .ToList();

            var addParents = new List<int>();
            foreach (var p in parents)
            {
                //Add to temp list so as to not modify 'parents' during iteration
                addParents.AddRange(GetParents(p, data));
            }
            //Transfer to actual list
            parents.AddRange(addParents);

            return parents;
        }

        private List<List<int>> GetGeoProps(int[] items, List<StandardVocabItem> vmsItems)
        {
            var geoItems = new List<List<int>>();

            foreach (var r in items)
            {
                var itemGroup = new List<int>();
                itemGroup.Add(r);
                itemGroup.AddRange(GetParents(r, vmsItems));

                geoItems.Add(itemGroup);
            }

            return geoItems;
        }
    }
}
