using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using System.Text;

namespace Database.Models
{
    public class Mitigation
    {
        public int MitigationId { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public string Value { get; set; }

        //FK - Department
        [Required]
        public int DepartmentId { get; set; }
        [Required]
        [IgnoreDataMember]
        public Department Department { get; set; }

        //FK - Stakeholder
        [Required]
        public int StakeholderId { get; set; }
        [Required]
        [IgnoreDataMember]
        public Stakeholder Stakeholder { get; set; }

        //FK - Event
        [Required]
        public int EventId { get; set; }
        [Required]
        [IgnoreDataMember]
        public Event Event { get; set; }

        //FK - TypeMitigation
        [Required]
        public int TypeMitigationId { get; set; }
        [Required]
        [IgnoreDataMember]
        public TypeMitigation TypeMitigation { get; set; }
    }
}
