using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using System.Text;

namespace Database.Models
{
    public class Event
    {
        public int EventId { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public string Location_WKT { get; set; }

        //FK - TypeEvent
        public int? TypeEventId { get; set; }
        [IgnoreDataMember]
        public TypeEvent TypeEvent { get; set; }

        //FK - TypeSource
        public int? TypeSourceId { get; set; }
        [IgnoreDataMember]
        public TypeSource TypeSource { get; set; }
    }
}
