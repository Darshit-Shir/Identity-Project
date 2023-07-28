using Microsoft.AspNetCore.Identity;

namespace Demo_Project.IdentityLogic
{
    public class ApplicationUser : IdentityUser
    {
        public string FirstName { get; set; }

        public string LastName { get; set; }
    }
}
