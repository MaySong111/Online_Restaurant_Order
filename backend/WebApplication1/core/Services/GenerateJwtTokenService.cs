using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using WebApplication1.core.Models;
using WebApplication1.core.Utility;

namespace WebApplication1.core.Services
{
    public class GenerateJwtTokenService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;

        public GenerateJwtTokenService(UserManager<ApplicationUser> userManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _configuration = configuration;
        }

        public async Task<string> GenerateJWTToken(ApplicationUser user)
        {
            var userRoles = await _userManager.GetRolesAsync(user);
            var userRole = userRoles.FirstOrDefault() ?? StaticRoles.Role_Customer;
            var authClaims = new List<Claim>
            {
                 new Claim(ClaimTypes.Name,user.Name),
                 new Claim(ClaimTypes.NameIdentifier,user.Id),
                 new Claim(ClaimTypes.Role,userRole)
            };

            var authSecret = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var singingCredentials = new SigningCredentials(authSecret, SecurityAlgorithms.HmacSha256); //用密钥+ 算法 进行加密--生成签名凭据-这就是jwt token的第三部分:签名

            var tokenObject = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                notBefore: DateTime.Now,
                expires: DateTime.Now.AddHours(_configuration.GetValue<int>("Jwt:ExpiresInHours")),
                signingCredentials: singingCredentials,
                claims: authClaims
            );
            string token = new JwtSecurityTokenHandler().WriteToken(tokenObject);
            return token;
        }
    }
}