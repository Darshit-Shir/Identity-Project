using System.ComponentModel.DataAnnotations;

namespace Demo_Product.Model.Models
{
    public class CategoryModel
    {
        [Key]
        public int id { get; set; }
        public string CategoryName { get; set; }
    }
}
