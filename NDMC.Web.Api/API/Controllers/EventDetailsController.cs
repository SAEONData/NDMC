using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ND3B_API.ControllerLogic;

namespace ND3B_API.Controllers
{
    [Produces("application/json")]
    [Route("api/Events/{id}")]
    public class EventDetailsController : Controller
    {
        private readonly EventDetailsControllerLogic _logic;

        public EventDetailsController()
        {
            _logic = new EventDetailsControllerLogic();
        }

        [Route("Test")]
        public string Test(int id)
        {
            return $"EVENTS/{id}";
        }
    }
}