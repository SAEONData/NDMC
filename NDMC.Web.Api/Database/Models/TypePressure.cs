//using System;
//using System.Collections.Generic;
//using System.ComponentModel.DataAnnotations;
//using System.Runtime.Serialization;
//using System.Text;

//namespace Database.Models
//{
//    public class TypePressure
//    {
//        public int TypePressureId { get; set; }

//        [Required]
//        public string TypePressureName { get; set; }

//        //FK - ParentTypePressure
//        public int? ParentTypePressureId { get; set; }
//        [IgnoreDataMember]
//        public TypePressure ParentTypePressure { get; set; }
//    }
//}
