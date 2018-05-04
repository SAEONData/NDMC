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

        [Required]
        public string EventName { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        public string Location_WKT { get; set; }

        //FK - TypeEvent
        [Required]
        public int TypeEventId { get; set; }
        [Required]
        [IgnoreDataMember]
        public TypeEvent TypeEvent { get; set; }

        //FK - AdminRegion
        [Required]
        public int AdminRegionId { get; set; }
        [Required]
        [IgnoreDataMember]
        public AdminRegion AdminRegion { get; set; }

        //FK - TypeSource
        [Required]
        public int TypeSourceId { get; set; }
        [Required]
        [IgnoreDataMember]
        public TypeSource TypeSource { get; set; }
    }
}
