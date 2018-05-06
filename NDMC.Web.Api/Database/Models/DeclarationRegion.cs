//using System;
//using System.Collections.Generic;
//using System.ComponentModel.DataAnnotations;
//using System.Runtime.Serialization;
//using System.Text;

//namespace Database.Models
//{
//    public class DeclarationRegion
//    {
//        public int DeclarationRegionId { get; set; }

//        //FK - AdminRegion
//        [Required]
//        public int AdminRegionId { get; set; }
//        [Required]
//        [IgnoreDataMember]
//        public AdminRegion AdminRegion { get; set; }

//        //FK - Declaration
//        [Required]
//        public int DeclarationId { get; set; }
//        [Required]
//        [IgnoreDataMember]
//        public Declaration Declaration { get; set; }
//    }
//}
