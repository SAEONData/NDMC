using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using System.Text;

namespace Database.Models
{
    public class DeclaredEvent
    {
        public int DeclaredEventId { get; set; }

        [Required]
        public DateTime Declared { get; set; }

        //FK - Event
        [Required]
        public int EventId { get; set; }
        [Required]
        [IgnoreDataMember]
        public Event Event { get; set; }
    }
}
