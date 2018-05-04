using Database.Contexts;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ND3B_API.ControllerLogic
{
   
    public class EventsListControllerLogic
    {
        public void Get()
        {
            using (var context = new SQLDBContext())
            {
                // do stuff
            }
        }
    }
}
