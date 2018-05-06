using API.ControllerLogic;
using Database.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace API.Controllers
{
    [Route("api/Events")]
    public class EventsListController : ApiController
    {
        private readonly EventsListControllerLogic _logic;

        public EventsListController()
        {
            _logic = new EventsListControllerLogic();
        }

        [Route("Test")]
        public string Test()
        {
            return "TEST";
        }

        public List<Event> Get()
        {
            return _logic.Get();
        }
    }
}
