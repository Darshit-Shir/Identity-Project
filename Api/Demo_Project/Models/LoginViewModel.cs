using System.ComponentModel.DataAnnotations;
using System.Xml.Linq;

namespace Demo_Project.Models
{
    public class LoginViewModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }
        [Display(Name = "Remember Me")]
        public bool RememberMe { get; set; }
    }
    public class LoginResponseModel
    {
        public string id { get; set; }
        public string Email { get; set; }
        public string JWTToken { get; set; }
    }
}
