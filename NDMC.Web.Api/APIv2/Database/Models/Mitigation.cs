using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using System.Text;

namespace APIv2.Database.Models
{
    public class Mitigation
    {
        public int MitigationId { get; set; }

        public long? Date { get; set; }

        public double? Value { get; set; }

        //FK - Event
        [Required]
        public int EventId { get; set; }
        [Required]
        public Event Event { get; set; }

        //FK - TypeMitigation
        [Required]
        public int TypeMitigationId { get; set; }
        [Required]
        public TypeMitigation TypeMitigation { get; set; }
    }
}
