using Demo_Project.Models;
using Demo_Project.ResponseDTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage;

namespace Demo_Project.Controllers
{
    [ApiController]
    public class AuthController : ControllerBase
    {
        [Route("AuthenticateUser")]
        [HttpPost]
        public string AuthenticateUser(RegistrationModel model)
        {
            return string.Empty;
        }
    }
}
