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
            var result = new EventDetailsViewModel();
            var eventList = new EventsListControllerLogic().List(id, "", "", "", "", "", 0, 0);
            if(eventList.Count > 0)
            {
                result = eventList[0];
            }

            return result;
        }
    }
}