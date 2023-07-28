using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Demo_Project.Models;
using System.Text.Encodings.Web;
using System.Text;
using Demo_Project.IdentityLogic;
using Microsoft.AspNetCore.Authorization;
using EmployeeWithRepository.Common;
using Microsoft.Extensions.Options;
using Demo_Project.ResponseDTOs;

namespace Demo_Project.Controllers
{
    [ApiController]
    [Route("api")]
    public class UserController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ApplicationSettings _appSettings;

        public UserController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IOptions<ApplicationSettings> appSettings)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _appSettings = appSettings.Value;
        }

        [HttpPost]
        [Route("Registration")]
        public async Task<IActionResult> RegisterUser(RegistrationModel userRegistration)
        {
            var user = new ApplicationUser {UserName= userRegistration.Email, Email = userRegistration.Email, FirstName = userRegistration.FirstName, LastName = userRegistration.LastName, EmailConfirmed = true};
            var result = await _userManager.CreateAsync(user, userRegistration.Password);

            if (!result.Succeeded)
                return Ok(400);

            return Ok(200);

        }

        [HttpPost]
        [AllowAnonymous]
        [Route("login")]
        public async Task<ApiPostResponse<LoginResponseModel>> Login(LoginViewModel user)
        {
            ApiPostResponse<LoginResponseModel> response = new ApiPostResponse<LoginResponseModel>();
                user.RememberMe = false;
                var result = await _signInManager.PasswordSignInAsync(user.Email, user.Password, user.RememberMe, false);
                
                response.Message = result.ToString();
                if (result.Succeeded)
                {
                    var us = await _userManager.FindByNameAsync(user.Email);

                    response.Data = new LoginResponseModel();
                    response.Success = true;
                    response.Message = "User Login Successfully";
                    response.Data.Email = user.Email;
                    response.Data.id = us.Id;
                    string _jwtToken = JWTToken.GenerateJSONWebToken(user.Email, user.Password, _appSettings.JWT_Secret);
                    response.Data.JWTToken = _jwtToken;
                }
                else
                {
                    response.Success = false;
                    response.Message = "Invalid Credentials";
                }
            return response;
        }
    }
}
