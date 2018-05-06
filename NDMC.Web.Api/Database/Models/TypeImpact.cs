using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using System.Text;

namespace Database.Models
{
    public class TypeImpact
    {
        public int TypeImpactId { get; set; }

        [Required]
        public string TypeImpactName { get; set; }

        public string UnitOfMeasure { get; set; }

        //FK - ParentTypeImpact
        [ForeignKey("ParentTypeImpact")]
        public int? ParentTypeImpactId { get; set; }
        [IgnoreDataMember]
        public TypeImpact ParentTypeImpact { get; set; }
    }
}
