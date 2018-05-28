using API.Controllers;
using API.Models;
using API.ViewModels;
using Database.Contexts;
using Database.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization.Formatters;
using System.Web;

namespace API.ControllerLogic
{
    public class EventsListControllerLogic
    {
        /// <summary>
        /// Get Events filtered by date, type and impact
        /// </summary>
        public List<EventDetailsViewModel> List(int eventId, string startDate, string endDate, string eventType, string impactType,
            string region, int batchSize, int batchCount)
        {
            var result = new List<EventDetailsViewModel>();

            //Convert params
            DateTime.TryParse(startDate, out DateTime parsedStartDate);
            DateTime.TryParse(endDate, out DateTime parsedEndDate);
            int.TryParse(eventType, out int parsedEventType);
            int.TryParse(impactType, out int parsedImpactType);
            int.TryParse(region, out int parsedRegion);

            //Parse dates to Unix format
            long unixStartDate = 0;
            long unixEndDate = 0;

            if (parsedStartDate != DateTime.MinValue)
            {
                unixStartDate = new DateTimeOffset(parsedStartDate).ToUnixTimeSeconds();
            }

            if (parsedEndDate != DateTime.MinValue)
            {
                unixEndDate = new DateTimeOffset(parsedEndDate).ToUnixTimeSeconds();
            }

            //Query GQL
            var gql = new GraphQLController();
            var data = gql.Request(new GraphQLRequest()
            {
                query = "{" +
                $"  Events(eventId: {eventId} startDate: {unixStartDate}, endDate: {unixEndDate}, eventType: {parsedEventType}, impactType: {parsedImpactType}, region: {parsedRegion}, batchSize: {batchSize}, batchCount: {batchCount})" + " {" +
                "    eventId" +
                "    startDate" +
                "    endDate" +
                "    declaredEvents {" +
                "      declaredDate" +
                "    }" +
                "    location_WKT" +
                "    typeEvent{" +
                "      typeEventName" +
                "    }" +
                "    eventImpacts{" +
                "      typeImpact{" +
                "        typeImpactName" +
                "        unitOfMeasure" +
                "      }" +
                "      measure" +
                "    }" +
                "    eventRegions{" +
                "      region{" +
                "        regionName" +
                "        regionType{" +
                "          regionTypeName" +
                "        }" +
                "      }" +
                "    }" +
                "  }" +
                "}"
            }).Data;

            //Transform GQL response data
            dynamic d = JObject.Parse(JsonConvert.SerializeObject(data, Formatting.Indented));
            foreach (var eventItem in d.Events)
            {
                var newEvent = new EventDetailsViewModel
                {
                    //EventId
                    EventId = eventItem.eventId,

                    //Location
                    Location = eventItem.location_WKT
                };

                //StartDate
                if (eventItem.startDate != null)
                {
                    newEvent.StartDate = DateTimeOffset.FromUnixTimeSeconds((long)eventItem.startDate).LocalDateTime;
                }

                //EndDate
                if (eventItem.endDate != null)
                {
                    newEvent.EndDate = DateTimeOffset.FromUnixTimeSeconds((long)eventItem.endDate).LocalDateTime;
                }

                //DeclaredDate
                if (eventItem.declaredEvents != null)
                {
                    foreach (var declaredEvent in eventItem.declaredEvents)
                    {
                        if (declaredEvent.declaredDate != null)
                        {
                            newEvent.DeclaredDates.Add(DateTimeOffset.FromUnixTimeSeconds((long)declaredEvent.declaredDate).LocalDateTime);
                        }
                    }
                }

                //EventType
                if (eventItem.typeEvent != null && eventItem.typeEvent.typeEventName != null)
                {
                    newEvent.EventType = eventItem.typeEvent.typeEventName;
                }

                //EventImpacts
                if (eventItem.eventImpacts != null)
                {
                    foreach (var eventImpact in eventItem.eventImpacts)
                    {
                        var newImpact = new EventImpactViewModel
                        {
                            Measure = eventImpact.measure
                        };

                        if (eventImpact.typeImpact != null)
                        {
                            newImpact.ImpactType = eventImpact.typeImpact.typeImpactName;
                            newImpact.UnitOfMeasure = eventImpact.typeImpact.unitOfMeasure;
                        }

                        newEvent.EventsImpacts.Add(newImpact);
                    }
                }

                //Regions
                if (eventItem.eventRegions != null)
                {
                    foreach (var eventRegion in eventItem.eventRegions)
                    {
                        if (eventRegion.region != null)
                        {
                            if (eventRegion.region.regionType != null && eventRegion.region.regionType.regionTypeName != "Ward") //Exclude Wards
                            {
                                var newRegion = new EventRegionViewModel
                                {
                                    RegionName = eventRegion.region.regionName
                                };

                                if (eventRegion.region.regionType != null)
                                {
                                    newRegion.RegionType = eventRegion.region.regionType.regionTypeName;
                                }

                                newEvent.Regions.Add(newRegion);
                            }
                        }
                    }
                }

                result.Add(newEvent);
            }

            return result;
        }

        public List<EventsGeoJsonViewModel> ListGEO(string startDate, string endDate, string eventType, string impactType, string region)
        {
            //Convert params
            DateTime.TryParse(startDate, out DateTime parsedStartDate);
            DateTime.TryParse(endDate, out DateTime parsedEndDate);
            int.TryParse(eventType, out int parsedEventType);
            int.TryParse(impactType, out int parsedImpactType);
            int.TryParse(region, out int parsedRegion);

            //Parse dates to Unix format
            long unixStartDate = 0;
            long unixEndDate = 0;

            if (parsedStartDate != DateTime.MinValue)
            {
                unixStartDate = new DateTimeOffset(parsedStartDate).ToUnixTimeSeconds();
            }

            if (parsedEndDate != DateTime.MinValue)
            {
                unixEndDate = new DateTimeOffset(parsedEndDate).ToUnixTimeSeconds();
            }

            var result = new List<EventsGeoJsonViewModel>();

            //Query GQL
            var gql = new GraphQLController();
            var data = gql.Request(new GraphQLRequest()
            {
                query = "{" +
                $"  Events(startDate: {unixStartDate}, endDate: {unixEndDate}, eventType: {parsedEventType}, impactType: {parsedImpactType}, region: {parsedRegion})" + " {" +
                "    eventId" +
                "    eventRegions{" +
                "      region{" +
                "        regionId" +
                "        regionName" +
                "        regionType{" +
                "          regionTypeName" +
                "        }" +
                "      }" +
                "    }" +
                "  }" +
                "}"
            }).Data;

            //Transform GQL response data
            dynamic d = JObject.Parse(JsonConvert.SerializeObject(data, Formatting.Indented));
            foreach (var eventItem in d.Events)
            {
                if (eventItem.eventRegions != null)
                {
                    foreach (var eventRegion in eventItem.eventRegions)
                    {
                        var geoItem = new EventsGeoJsonViewModel();
                        geoItem.type = "Feature";

                        //EventId
                        if (eventItem.eventId != null)
                        {
                            geoItem.properties.Add("event_id", ((int)eventItem.eventId).ToString());
                        }

                        //RegionId
                        if (eventRegion.region.regionId != null)
                        {
                            geoItem.properties.Add("region_id", ((int)eventRegion.region.regionId).ToString());
                        }

                        //RegionName
                        if (eventRegion.region.regionName != null)
                        {
                            geoItem.properties.Add("region_name", ((string)eventRegion.region.regionName));
                        }

                        //RegionTypeName
                        if (eventRegion.region.regionType != null && eventRegion.region.regionType.regionTypeName != null)
                        {
                            geoItem.properties.Add("region_type", ((string)eventRegion.region.regionType.regionTypeName));
                        }

                        result.Add(geoItem);
                    }
                }
            }

            return result;
        }

        public List<Region> GetRegions()
        {
            var results = new List<Region>();

            //Query GQL
            var gql = new GraphQLController();
            var data = gql.Request(new GraphQLRequest()
            {
                query = "{" +
                "  Regions{" +
                "    regionId" +
                "    regionName" +
                "    parentRegionId" +
                "    regionTypeId" +
                "  }" +
                "}"
            }).Data;

            //Transform GQL response data
            dynamic d = JObject.Parse(JsonConvert.SerializeObject(data, Formatting.Indented));
            foreach (var regionItem in d.Regions)
            {
                var newRegion = new Region();

                //RegionId
                if (regionItem.regionId != null)
                {
                    newRegion.RegionId = regionItem.regionId;
                }

                //RegionName
                if (regionItem.regionName != null)
                {
                    newRegion.RegionName = regionItem.regionName;
                }

                //ParentRegionId
                if (regionItem.parentRegionId != null)
                {
                    newRegion.ParentRegionId = regionItem.parentRegionId;
                }

                //RegionTypeId
                if (regionItem.regionTypeId != null)
                {
                    newRegion.RegionTypeId = regionItem.regionTypeId;
                }

                results.Add(newRegion);
            }

            return results;
        }

        public List<TypeEvent> GetEventTypes()
        {
            var results = new List<TypeEvent>();

            //Query GQL
            var gql = new GraphQLController();
            var data = gql.Request(new GraphQLRequest()
            {
                query = "{" +
                "  TypeEvents{" +
                "    typeEventId" +
                "    typeEventName" +
                "  }" +
                "}"
            }).Data;

            //Transform GQL response data
            dynamic d = JObject.Parse(JsonConvert.SerializeObject(data, Formatting.Indented));
            foreach (var typeEventItem in d.TypeEvents)
            {
                var newTypeEvent = new TypeEvent();

                //RegionId
                if (typeEventItem.typeEventId != null)
                {
                    newTypeEvent.TypeEventId = typeEventItem.typeEventId;
                }

                //RegionName
                if (typeEventItem.typeEventName != null)
                {
                    newTypeEvent.TypeEventName = typeEventItem.typeEventName;
                }

                results.Add(newTypeEvent);
            }

            return results;
        }

        public bool PublishEvents(List<ScraperEvent> events)
        {
            var result = false;

            using (var context = new SQLDBContext())
            {
                foreach (var e in events)
                {
                    //Add TypeImpacts (stocks)
                    var typeImpacts = new List<TypeImpact>();
                    foreach (var stock in e.stocks)
                    {
                        if (context.TypeImpacts.Count(t => t.TypeImpactName == stock) == 0)
                        {
                            typeImpacts.Add(
                                context.TypeImpacts.Add(new TypeImpact()
                                {
                                    TypeImpactName = stock
                                })
                            );
                        }
                        else
                        {
                            typeImpacts.Add(context.TypeImpacts.FirstOrDefault(t => t.TypeImpactName == stock));
                        }
                    }

                    //Add TypeEvent (hazard)
                    TypeEvent eventType = null;
                    if (e.hazards.Count > 0)
                    {
                        string tmpHazard = e.hazards[0];
                        if (context.TypeEvents.Count(t => t.TypeEventName == tmpHazard) == 0)
                        {
                            eventType = context.TypeEvents.Add(new TypeEvent()
                            {
                                TypeEventName = tmpHazard
                            });
                        }
                        else
                        {
                            eventType = context.TypeEvents.FirstOrDefault(t => t.TypeEventName == tmpHazard);
                        }
                    }

                    //Add Source
                    TypeSource eventSource = null;
                    if (context.TypeSources.Count(s => s.TypeSourceName == e.event_type && s.TypeSourceSource == e.source) == 0)
                    {
                        eventSource = context.TypeSources.Add(new TypeSource()
                        {
                            TypeSourceName = e.event_type,
                            TypeSourceSource = e.source
                        });
                    }
                    else
                    {
                        eventSource = context.TypeSources.FirstOrDefault(s => s.TypeSourceName == e.event_type && s.TypeSourceSource == e.source);
                    }

                    //Add Region
                    Region eventRegion = null;
                    if (context.Regions.Count(r => r.RegionName == e.locality) == 0)
                    {
                        eventRegion = context.Regions.Add(new Region()
                        {
                            RegionName = e.locality
                        });
                    }
                    else
                    {
                        eventRegion = context.Regions.FirstOrDefault(r => r.RegionName == e.locality);
                    }

                    //Add Events
                    var newEvent = context.Events.Add(new Event()
                    {
                        TypeEvent = eventType,
                        TypeSource = eventSource
                    });

                    //Add/Link EventImpacts
                    foreach (var item in typeImpacts)
                    {
                        context.EventImpacts.Add(new EventImpact()
                        {
                            Event = newEvent,
                            TypeImpact = item
                        });
                    }

                    //Add/Link EventRegions
                    context.EventRegions.Add(new EventRegion()
                    {
                        Event = newEvent,
                        Region = eventRegion
                    });
                }

                context.SaveChanges();
                result = true;
            }

            return result;
        }
    }
}