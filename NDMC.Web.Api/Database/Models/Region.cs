using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using System.Text;

namespace Database.Models
{
    public class Region
    {
        public int RegionId { get; set; }

        [Required]
        public string RegionName { get; set; }

        //FK - ParentAdminRegion
        [ForeignKey("ParentRegion")]
        public int? ParentRegionId { get; set; }
        [IgnoreDataMember]
        public Region ParentRegion { get; set; }

        //FK - RegionType
        [ForeignKey("RegionType")]
        public int? RegionTypeId { get; set; }
        [IgnoreDataMember]
        public RegionType RegionType { get; set; }
    }
}
