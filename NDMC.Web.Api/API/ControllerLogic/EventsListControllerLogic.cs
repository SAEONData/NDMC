using API.ViewModels;
using Database.Contexts;
using Database.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace API.ControllerLogic
{
    public class EventsListControllerLogic
    {
        /// <summary>
        /// Get Events filtered by date, type and impact
        /// </summary>
        public List<EventDetailsViewModel> List(string startDate = "", string endDate = "", string eventType = "", string impactType = "", string region = "")
        {
            //Convert params
            DateTime.TryParse(startDate, out DateTime parsedStartDate);
            DateTime.TryParse(endDate, out DateTime parsedEndDate);
            int.TryParse(eventType, out int parsedEventType);
            int.TryParse(impactType, out int parsedImpactType);
            int.TryParse(region, out int parsedRegion);

            var result = new List<EventDetailsViewModel>();

            using (var context = new SQLDBContext())
            {
                //Get data
                var query = (from events in context.Events
                            join declaredEvents in context.DeclaredEvents on events.EventId equals declaredEvents.EventId
                            join eventTypes in context.TypeEvents on events.TypeEventId equals eventTypes.TypeEventId
                            select new
                            {
                                Events = events,
                                DeclaredEvents = declaredEvents,
                                EventTypes = eventTypes,

                                EventsImpacts = (from eventImpacts in context.EventImpacts
                                                 join typeImpacts in context.TypeImpacts on eventImpacts.TypeImpactId equals typeImpacts.TypeImpactId
                                                 where eventImpacts.EventId == events.EventId
                                                 select new
                                                 {
                                                     TypeImpacts = typeImpacts,
                                                     EventImpacts = eventImpacts
                                                 }).ToList(),

                                Regions = context.EventRegions
                                            .Where(er => er.EventId == events.EventId && er.Region.RegionType.RegionTypeName != "Ward")
                                            .Select(x => new
                                            {
                                                x.RegionId,
                                                x.Region.RegionName,
                                                x.Region.RegionType.RegionTypeName
                                            }).ToList()
                            });

                //Filter and construct return type
                var subquery = query
                                .Where(x => 
                                    ((x.Events.StartDate >= parsedStartDate || parsedStartDate == DateTime.MinValue) && (x.Events.EndDate <= parsedEndDate || parsedEndDate == DateTime.MinValue)) &&
                                    (x.EventTypes.TypeEventId == parsedEventType || parsedEventType == 0) &&
                                    ((x.EventsImpacts.Count(y => y.TypeImpacts.TypeImpactId == parsedImpactType) > 0 || parsedImpactType == 0)) &&
                                    (x.Regions.Count(y => y.RegionId == parsedRegion) > 0 || parsedRegion == 0))
                                .Select(x => new EventDetailsViewModel
                                {
                                    EventId = x.Events.EventId,
                                    StartDate = x.Events.StartDate,
                                    EndDate = x.Events.EndDate,
                                    DeclaredDate = x.DeclaredEvents.DeclaredDate,
                                    Location = x.Events.Location_WKT,
                                    EventType = x.EventTypes.TypeEventName,

                                    EventsImpacts = x.EventsImpacts.Select(y => new EventImpactViewModel
                                    {
                                        ImpactType = y.TypeImpacts.TypeImpactName,
                                        UnitOfMeasure = y.TypeImpacts.UnitOfMeasure,
                                        Measure = y.EventImpacts.Measure
                                    }).ToList(),

                                    Regions = x.Regions.Select(y => new EventRegionViewModel
                                    {
                                        RegionType = y.RegionTypeName,
                                        RegionName = y.RegionName
                                    }).ToList()
                                })
                                .OrderBy(x => x.DeclaredDate);  

                result = subquery.ToList();
            }

            return result;
        }

        public List<EventsGeoJsonViewModel> ListGEO(string startDate = "", string endDate = "", string eventType = "", string impactType = "", string region = "")
        {
            //Convert params
            DateTime.TryParse(startDate, out DateTime parsedStartDate);
            DateTime.TryParse(endDate, out DateTime parsedEndDate);
            int.TryParse(eventType, out int parsedEventType);
            int.TryParse(impactType, out int parsedImpactType);
            int.TryParse(region, out int parsedRegion);

            var result = new List<EventsGeoJsonViewModel>();

            using (var context = new SQLDBContext())
            {
                //Get data and filter
                var query = from events in context.Events
                            join declaredEvents in context.DeclaredEvents on events.EventId equals declaredEvents.EventId
                            join eventTypes in context.TypeEvents on events.TypeEventId equals eventTypes.TypeEventId
                            join eventImpacts in context.EventImpacts on events.EventId equals eventImpacts.EventId
                            join typeImpacts in context.TypeImpacts on eventImpacts.TypeImpactId equals typeImpacts.TypeImpactId
                            join eventRegions in context.EventRegions on events.EventId equals eventRegions.EventId
                            join regions in context.Regions on eventRegions.RegionId equals regions.RegionId
                            where
                            (
                                (events.StartDate >= parsedStartDate && (events.EndDate <= parsedEndDate || parsedEndDate == DateTime.MinValue))
                                &&
                                (eventTypes.TypeEventId == parsedEventType || parsedEventType == 0)
                                &&
                                (typeImpacts.TypeImpactId == parsedImpactType || parsedImpactType == 0)
                                &&
                                (regions.RegionType.RegionTypeName != "Ward")
                            )
                            orderby declaredEvents.DeclaredDate
                            select new
                            {
                                events.EventId,
                                regions.RegionId,
                                regions.RegionName,
                                regions.RegionType.RegionTypeName
                            };

                //Construct return type
                foreach (var item in query.Distinct().ToList())
                {
                    var geoItem = new EventsGeoJsonViewModel();
                    geoItem.type = "Feature";
                    geoItem.properties.Add("event_id", item.EventId.ToString());
                    geoItem.properties.Add("region_id", item.RegionId.ToString());
                    geoItem.properties.Add("region_name", item.RegionName);
                    geoItem.properties.Add("region_type", item.RegionTypeName);

                    result.Add(geoItem);
                }
            }

            return result;
        }
    }
}