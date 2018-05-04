using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using System.Text;

namespace Database.Models
{
    public class TypeImpact
    {
        public int TypeImpactId { get; set; }

        [Required]
        public string TypeImpactName { get; set; }

        //FK - ParentTypeImpact
        [Required]
        public int ParentTypeImpactId { get; set; }
        [Required]
        [IgnoreDataMember]
        public TypeImpact ParentTypeImpact { get; set; }
    }
}
