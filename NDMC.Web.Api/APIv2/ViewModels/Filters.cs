using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace APIv2.ViewModels
{
    public class Filters
    {
        public int region { get; set; }
        public int impact { get; set; }
        public int hazard { get; set; }
        public int startDate { get; set; }
        public int endDate { get; set; }
        public int batchSize { get; set; }
        public string favorites { get; set; }
    }
}
