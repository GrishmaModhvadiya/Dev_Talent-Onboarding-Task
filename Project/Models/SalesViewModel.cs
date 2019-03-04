using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Project.Models
{
    public class SalesViewModel
    {
          public int Id { get; set; }
            public string ProductName { get; set; }
            public int ProductId { get; set; }
            public string CustomerName { get; set; }
            public int CustomerId { get; set; }
            public string StoreName { get; set; }
            public int StoreId { get; set; }
            [Required]
            public DateTime DateSold { get; set; }


    }
}