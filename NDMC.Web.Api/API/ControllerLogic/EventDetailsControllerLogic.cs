using API.ViewModels;
using Database.Contexts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace API.ControllerLogic
{
    public class EventDetailsControllerLogic
    {
        public EventDetailsViewModel GetById(int id)
        {
            EventDetailsViewModel result = null;

            using (var context = new SQLDBContext())
            {
                //Get data
                var query = (from events in context.Events
                             join declaredEvents in context.DeclaredEvents on events.EventId equals declaredEvents.EventId
                             join eventTypes in context.TypeEvents on events.TypeEventId equals eventTypes.TypeEventId
                             where events.EventId == id
                             select new EventDetailsViewModel
                             {
                                 EventId = events.EventId,
                                 StartDate = events.StartDate,
                                 EndDate = events.EndDate,
                                 DeclaredDate = declaredEvents.DeclaredDate,
                                 Location = events.Location_WKT,
                                 EventType = eventTypes.TypeEventName,

                                 EventsImpacts = (from eventImpacts in context.EventImpacts
                                                  join typeImpacts in context.TypeImpacts on eventImpacts.TypeImpactId equals typeImpacts.TypeImpactId
                                                  where eventImpacts.EventId == events.EventId
                                                  select new EventImpactViewModel
                                                  {
                                                      ImpactType = typeImpacts.TypeImpactName,
                                                      UnitOfMeasure = typeImpacts.UnitOfMeasure,
                                                      Measure = eventImpacts.Measure
                                                  }).ToList(),

                                 Regions = context.EventRegions
                                             .Where(er => er.EventId == events.EventId && er.Region.RegionType.RegionTypeName != "Ward")
                                             .Select(x => new EventRegionViewModel
                                             {
                                                 RegionType = x.Region.RegionType.RegionTypeName,
                                                 RegionName = x.Region.RegionName
                                             }).ToList()
                             });

                result = query.FirstOrDefault();
            }

            return result;
        }
    }
}