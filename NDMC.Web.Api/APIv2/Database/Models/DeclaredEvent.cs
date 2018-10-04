using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using System.Text;

namespace APIv2.Database.Models
{
    public class DeclaredEvent
    {
        public int DeclaredEventId { get; set; }

        public long? DeclaredDate { get; set; }

        //FK - Event
        [Required]
        public int EventId { get; set; }
        [Required]
        //[IgnoreDataMember]
        public Event Event { get; set; }
    }
}
