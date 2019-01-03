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
        public int EventRegionId { get; set; }
        //[Required]
        public EventRegion EventRegion { get; set; }

        //FK - TypeImpact
        [Required]
        public int TypeImpactId { get; set; }
        //[Required]
        public TypeImpact TypeImpact { get; set; }
        
        public string UnitOfMeasure { get; set; }
    }
}
