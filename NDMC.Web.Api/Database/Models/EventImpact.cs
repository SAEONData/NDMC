using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using System.Text;

namespace Database.Models
{
    public class EventImpact
    {
        public int EventImpactId { get; set; }

        [Required]
        public int Measure { get; set; }

        [Required]
        public string UnitOfMeasure { get; set; }

        //FK - Event
        [Required]
        public int EventId { get; set; }
        [Required]
        [IgnoreDataMember]
        public Event Event { get; set; }

        //FK - TypeImpact
        [Required]
        public int TypeImpactId { get; set; }
        [Required]
        [IgnoreDataMember]
        public TypeImpact TypeImpact { get; set; }
    }
}
