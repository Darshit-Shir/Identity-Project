using System.ComponentModel.DataAnnotations;

namespace Demo_Product.Model.Models
{
    public class ProductModel
    {
        [Key]
        public int id { get; set; }
        public string? Image { get; set; }

        public string Name { get; set; }

        public string Category { get; set; }
        public string? CategoryName { get; set; }

        public string Description { get; set; }

        public int Quantity { get; set; }

        public DateTime Manufacturing_Date { get; set; }

        public bool IsOutofstock { get; set; }

        public string Color { get; set; }

        public double Price { get; set; }
        public string Mode { get; set; }
        public bool? IsActive { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string? ModifiedBy { get; set; }

    }
}
