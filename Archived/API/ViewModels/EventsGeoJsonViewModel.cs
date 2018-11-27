using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace API.ViewModels
{
    public class EventsGeoJsonViewModel
    {
        public string type { get; set; }
        public Geometry geometry { get; set; } = new Geometry();
        public Dictionary<string, string> properties { get; set; } = new Dictionary<string, string>();
    }

    public class Geometry
    {
        public string type { get; set; }
        public List<double> coordinates { get; set; }

        public Geometry()
        {
            coordinates = new List<double>();
        }
    }
}