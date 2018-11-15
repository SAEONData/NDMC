using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using System.Text;

namespace APIv2.Database.Models
{
    public class TypeEvent //Hazard
    {
        public int TypeEventId { get; set; }

        [Required]
        public string TypeEventName { get; set; }
    }
}
