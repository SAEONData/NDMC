using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Database.Models
{
    public class TypeSource
    {
        public int TypeSourceId { get; set; }

        [Required]
        public string TypeSourceName { get; set; }

        public string TypeSourceSource { get; set; }
    }
}
