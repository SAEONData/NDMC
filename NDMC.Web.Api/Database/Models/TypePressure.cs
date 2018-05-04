using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using System.Text;

namespace Database.Models
{
    public class TypePressure
    {
        public int TypePressureId { get; set; }

        [Required]
        public string TypePressureName { get; set; }

        //FK - ParentTypePressure
        [Required]
        public int ParentTypePressureId { get; set; }
        [Required]
        [IgnoreDataMember]
        public TypePressure ParentTypePressure { get; set; }
    }
}
