using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace API.ViewModels
{
    public class EventDetailsViewModel
    {
        public int EventId { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime? DeclaredDate { get; set; }
        public string Location { get; set; }
        public string EventType { get; set; }
        public List<EventImpactViewModel> EventsImpacts { get; set; }
        public List<EventRegionViewModel> Regions { get; set; }
    }

    public class EventImpactViewModel
    {
        public string ImpactType { get; set; }
        public string UnitOfMeasure { get; set; }
        public double? Measure { get; set; }
    }

    public class EventRegionViewModel
    {
        public string RegionType { get; set; }
        public string RegionName { get; set; }
    }
}