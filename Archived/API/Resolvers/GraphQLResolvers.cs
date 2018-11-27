using Database.Contexts;
using Database.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace API.Resolvers
{
    public class GraphQLResolvers
    {
        public IQueryable<Event> Events(SQLDBContext qc, int eventId, long startDate, long endDate, int eventType,
            int impactType, int region, int batchSize, int batchCount)
        {
            //Convert batch params
            if (batchSize <= 0)
            {
                batchSize = qc.Events.Count();
            }

            if (batchCount <= 0)
            {
                batchCount = 1;
            }

            //Get data
            var qr = qc.Events
                .Where(e => 
                    (eventId == 0 || e.EventId == eventId) &&
                    (e.StartDate >= startDate || startDate == 0) &&
                    (e.EndDate <= endDate || endDate == 0) &&
                    (e.TypeEvent.TypeEventId == eventType || eventType == 0) &&
                    (e.EventImpacts.Count(y => y.TypeImpact.TypeImpactId == impactType) > 0 || impactType == 0) &&
                    (e.EventRegions.Count(y => y.RegionId == region) > 0 || region == 0));

            return qr;
        }

        public IQueryable<Region> Regions(SQLDBContext qc)
        {
            return qc.Regions;
        }
    }
}