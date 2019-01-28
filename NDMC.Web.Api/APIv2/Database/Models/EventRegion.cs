using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace APIv2.Database.Models
{
    public class EventRegion
    {
        public int EventRegionId { get; set; }

        //FK - Event
        [Required]
        public int EventId { get; set; }
        //[Required]
        public Event Event { get; set; }

        //FK - Region
        [Required]
        public int RegionId { get; set; }

        public ICollection<EventImpact> EventImpacts { get; set; }
    }
}
