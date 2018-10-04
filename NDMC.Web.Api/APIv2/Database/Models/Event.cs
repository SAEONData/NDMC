using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using System.Text;

namespace APIv2.Database.Models
{
    public class Event
    {
        public int EventId { get; set; }

        public long? StartDate { get; set; }

        public long? EndDate { get; set; }

        public string Location_WKT { get; set; }

        //FK - TypeEvent
        public int? TypeEventId { get; set; }
        //[IgnoreDataMember]
        public TypeEvent TypeEvent { get; set; }

        //FK - TypeSource
        public int? TypeSourceId { get; set; }
        //[IgnoreDataMember]
        public TypeSource TypeSource { get; set; }

        public ICollection<EventImpact> EventImpacts { get; set; }
        public ICollection<EventRegion> EventRegions { get; set; }
        public ICollection<DeclaredEvent> DeclaredEvents { get; set; }
    }
}
