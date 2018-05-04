using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using System.Text;

namespace Database.Models
{
    public class AdminRegion
    {
        public int AdminRegionId { get; set; }

        [Required]
        public string AdminRegionName { get; set; }

        //FK - ParentAdminRegion
        [Required]
        public int ParentAdminRegionId { get; set; }
        [Required]
        [IgnoreDataMember]
        public AdminRegion ParentAdminRegion { get; set; }
    }
}
