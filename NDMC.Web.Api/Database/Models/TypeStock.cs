//using System;
//using System.Collections.Generic;
//using System.ComponentModel.DataAnnotations;
//using System.Runtime.Serialization;
//using System.Text;

//namespace Database.Models
//{
//    public class TypeStock
//    {
//        public int TypeStockId { get; set; }

//        [Required]
//        public string TypeStockName { get; set; }

//        //FK - ParentTypeStock
//        public int? ParentTypeStockId { get; set; }
//        [IgnoreDataMember]
//        public TypeStock ParentTypeStock { get; set; }
//    }
//}
