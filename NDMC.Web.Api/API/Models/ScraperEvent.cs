using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace API.Models
{
    public class ScraperEvent
    {
        public int key { get; set; }
        public string timestamp { get; set; }
        public List<string> stocks { get; set; }
        public List<string> hazards { get; set; }
        public string source { get; set; }
        public string event_type { get; set; }
        public string locality { get; set; }
    }
}