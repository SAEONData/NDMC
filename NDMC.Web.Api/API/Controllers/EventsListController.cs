using API.ControllerLogic;
using API.Models;
using API.ViewModels;
using Database.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace API.Controllers
{
    public class EventsListController : ApiController
    {
        private readonly EventsListControllerLogic _logic;

        public EventsListController()
        {
            _logic = new EventsListControllerLogic();
        }

        /// <summary>
        /// Get events (filtered)
        /// </summary>
        /// <param name="startDate">Start date filter</param>
        /// <param name="endDate">End date filter</param>
        /// <param name="eventType">Type of event</param>
        /// <param name="impactType">Impact type of event</param>
        /// <param name="region">Event region</param>
        /// <returns>List of events with associated data</returns>
        [Route("api/Events/List")]
        [HttpGet]
        public List<EventDetailsViewModel> List(string startDate = "", string endDate = "", string eventType = "", string impactType = "", 
            string region = "", int batchSize = 0, int batchCount = 0)
        {
            return _logic.List(startDate, endDate, eventType, impactType, region, batchSize, batchCount);
        }

        /// <summary>
        /// Get events (filtered)
        /// </summary>
        /// <param name="startDate">Start date filter</param>
        /// <param name="endDate">End date filter</param>
        /// <param name="eventType">Type of event</param>
        /// <param name="impactType">Impact type of event</param>
        /// <param name="region">Event region</param>
        /// <returns>List of events with associated data in GeoJSON format</returns>
        [Route("api/Events/ListGEO")]
        [HttpGet]
        public List<EventsGeoJsonViewModel> ListGEO(string startDate = "", string endDate = "", string eventType = "", string impactType = "", string region = "")
        {
            return _logic.ListGEO(startDate, endDate, eventType, impactType, region);
        }

        /// <summary>
        /// Get list of regions
        /// </summary>
        /// <returns>List of Region</returns>
        [Route("api/Events/Regions")]
        [HttpGet]
        public List<Region> GetRegions()
        {
            return _logic.GetRegions();
        }

        /// <summary>
        /// Get list of event types
        /// </summary>
        /// <returns>List of TypeEvent</returns>
        [Route("api/Events/EventTypes")]
        [HttpGet]
        public List<TypeEvent> GetEventTypes()
        {
            return _logic.GetEventTypes();
        }

        [Route("api/Events/Publish")]
        [HttpPost]
        public bool PublishEvents([FromBody]List<ScraperEvent> events)
        {
            return _logic.PublishEvents(events);
        }
    }
}
