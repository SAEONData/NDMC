using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using System.Text;

namespace Database.Models
{
    public class TypeEvent //Hazard
    {
        public int TypeEventId { get; set; }

        [Required]
        public string TypeEventName { get; set; }

        ////FK - TypePressure
        //public int? TypePressureId { get; set; }
        //[IgnoreDataMember]
        //public TypePressure TypePressure { get; set; }

        ////FK - TypeStock
        //public int? TypeStockId { get; set; }
        //[IgnoreDataMember]
        //public TypeStock TypeStock { get; set; }

        ////FK - ParentTypeEvent
        //public int? ParentTypeEventId { get; set; }
        //[IgnoreDataMember]
        //public TypeEvent ParentTypeEvent { get; set; }
    }
}
