using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using System.Text;

namespace Database.Models
{
    public class TypeMitigation
    {
        public int TypeMitigationId { get; set; }

        [Required]
        public string TypeMitigationName { get; set; }

        //FK - ParentTypeImpact
        [Required]
        public int ParentTypeMitigationId { get; set; }
        [Required]
        [IgnoreDataMember]
        public TypeMitigation ParentTypeMitigation { get; set; }
    }
}
