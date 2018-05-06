using API.ControllerLogic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace API.Controllers
{
    [Route("api/Events/{id}")]
    public class EventDetailsController : ApiController
    {
        private readonly EventDetailsControllerLogic _logic;

        public EventDetailsController()
        {
            _logic = new EventDetailsControllerLogic();
        }

        [Route("Test")]
        public string Test(int id)
        {
            return $"TEST/{id}";
        }
    }
}
