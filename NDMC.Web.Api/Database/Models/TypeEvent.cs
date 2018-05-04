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

        //FK - TypePressure
        [Required]
        public int TypePressureId { get; set; }
        [Required]
        [IgnoreDataMember]
        public TypePressure TypePressure { get; set; }

        //FK - TypeStock
        [Required]
        public int TypeStockId { get; set; }
        [Required]
        [IgnoreDataMember]
        public TypeStock TypeStock { get; set; }

        //FK - ParentTypeEvent
        [Required]
        public int ParentTypeEventId { get; set; }
        [Required]
        [IgnoreDataMember]
        public TypeEvent ParentTypeEvent { get; set; }
    }
}
