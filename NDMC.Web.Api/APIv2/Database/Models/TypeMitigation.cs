using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using System.Text;

namespace APIv2.Database.Models
{
    public class TypeMitigation
    {
        public int TypeMitigationId { get; set; }

        [Required]
        public string TypeMitigationName { get; set; }

        public string UnitOfMeasure { get; set; }

        //FK - ParentTypeImpact
        [ForeignKey("ParentTypeMitigation")]
        public int? ParentTypeMitigationId { get; set; }
        //[IgnoreDataMember]
        public TypeMitigation ParentTypeMitigation { get; set; }
    }
}
