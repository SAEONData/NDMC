using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using System.Text;

namespace APIv2.Database.Models
{
    public class EventImpact
    {
        public int EventImpactId { get; set; }

        public double? Measure { get; set; }

        //FK - Event
        [Required]
        public int EventId { get; set; }
        [Required]
        //[IgnoreDataMember]
        public Event Event { get; set; }

        //FK - TypeImpact
        [Required]
        public int TypeImpactId { get; set; }
        [Required]
        //[IgnoreDataMember]
        public TypeImpact TypeImpact { get; set; }
    }
}
