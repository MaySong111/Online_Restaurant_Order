using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.core.Auth.Dtos;
using WebApplication1.core.Dtos;
using WebApplication1.core.Dtos.Auth;
using WebApplication1.core.Models;
using WebApplication1.core.Services;
using WebApplication1.core.Utility;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(UserManager<ApplicationUser> _userManager, IConfiguration _configuration, GenerateJwtTokenService _generateJwtTokenService) : ControllerBase
    {
        [HttpPost("register")]
        public async Task<ActionResult> Register([FromBody] RegisterRequestDto dto)
        {
            // 1. Check if user with the same email already exists
            var existingUser = await _userManager.FindByEmailAsync(dto.Email);
            if (existingUser != null)
            {
                return BadRequest(new { Message = "User with this email already exists." });
            }

            // 2. Check password strength
            if (dto.Password.Length < 6 || !dto.Password.Any(char.IsUpper) || !dto.Password.Any(char.IsLower) || !dto.Password.Any(char.IsDigit))
            {
                return BadRequest(new
                {
                    Message = "Password must be at least 6 characters long and contain uppercase, lowercase, and numeric characters."
                });

            }
            // 3. Create new user
            var newUser = new ApplicationUser
            {
                UserName = dto.Email, // Using email as username
                Email = dto.Email,
                Name = dto.Name,
            };

            // 4. Save user to the database
            var result = await _userManager.CreateAsync(newUser, dto.Password);
            if (!result.Succeeded)
            {
                return BadRequest(new
                {
                    Message = "User registration failed."
                });
            }

            // 5. Assign "Customer" role to the new user
            await _userManager.AddToRoleAsync(newUser, StaticRoles.Role_Customer);
            return Ok(new
            {
                Message = "User registered successfully."
            });
        }

        [HttpPost("login")]
        public async Task<ActionResult<ApiResponseDto<LoginResponseDto>>> Login([FromBody] LoginRequestDto dto)
        {
            // Implement login logic here
            //1. Find user by email
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
            {
                return BadRequest(new ApiResponseDto<object?>
                {
                    Message = "User not found."
                });
            }
            //2. Check password
            var isPasswordValid = await _userManager.CheckPasswordAsync(user, dto.Password);
            if (!isPasswordValid)
            {
                return BadRequest(new ApiResponseDto<object?>
                {
                    Message = "Invalid password."
                });
            }
            //3. Generate JWT token
            var token = await _generateJwtTokenService.GenerateJWTToken(user);
            return Ok(new ApiResponseDto<LoginResponseDto>
            {
                Message = "Login successful.",
                Data = new LoginResponseDto
                {
                    Email = user.Email,
                    Token = token
                }
            });

        }
    }
}