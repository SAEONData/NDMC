using API.ControllerLogic;
using API.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace API.Controllers
{
    public class EventDetailsController : ApiController
    {
        private readonly EventDetailsControllerLogic _logic;

        public EventDetailsController()
        {
            _logic = new EventDetailsControllerLogic();
        }

        /// <summary>
        /// Get event details
        /// </summary>
        /// <param name="id">ID of event</param>
        /// <returns>Event details</returns>
        [HttpGet]
        [Route("api/Events/Details/{id}")]
        public EventDetailsViewModel GetById(int id)
        {
            return _logic.GetById(id);
        }
    }
}
