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
        public List<Event> Get()
        {
            var result = new List<Event>();

            using (var context = new SQLDBContext())
            {
                result = context.Events.ToList();
            }

            return result;
        }
    }
}