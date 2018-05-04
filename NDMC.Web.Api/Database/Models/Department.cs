using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using System.Text;

namespace Database.Models
{
    public class Department
    {
        public int DepartmentId { get; set; }

        [Required]
        public string DepartmentName { get; set; }

        //FK - AdminRegion
        [Required]
        public int AdminRegionId { get; set; }
        [Required]
        [IgnoreDataMember]
        public AdminRegion AdminRegion { get; set; }
    }
}
