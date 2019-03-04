using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Project.Models
{
    public class ProductViewModel
    {
       
            public int Id { get; set; }
            [Required]
            [StringLength(50)]
            public string Name { get; set; }
            [Required]
            public decimal Price { get; set; }
        
    }
}