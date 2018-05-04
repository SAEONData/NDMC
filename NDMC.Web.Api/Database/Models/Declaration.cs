using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using System.Text;

namespace Database.Models
{
    public class Declaration
    {
        public int DeclarationId { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public string Authority { get; set; }

        [Required]
        public string Document { get; set; }

        //FK - TypeEvent
        [Required]
        public int TypeEventId { get; set; }
        [Required]
        [IgnoreDataMember]
        public TypeEvent TypeEvent { get; set; }
    }
}
