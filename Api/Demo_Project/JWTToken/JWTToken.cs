using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeWithRepository.Common
{
    public class JWTToken
    {
        public static string GenerateJSONWebToken(string EmailId, string password, string SecretKey)
        {

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SecretKey));
            var signCred = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var claims = new ClaimsIdentity(new Claim[]
                {
                    new Claim("Email", EmailId),
                    new Claim("Password", password)
                });

            SecurityTokenDescriptor tokenDescriptor = new SecurityTokenDescriptor
            {
                Issuer = "Test",
                Audience = "Test",
                Subject = claims,
                Expires = DateTime.Now.AddMinutes(10000),
                SigningCredentials = signCred
            };

            JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
            SecurityToken securityToken = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(securityToken);
        }
    }
}
