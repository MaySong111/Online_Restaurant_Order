using System.Net;
using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.core.Auth.Dtos;
using WebApplication1.core.DbData;
using WebApplication1.core.Dtos;
using WebApplication1.core.Dtos.Auth;
using WebApplication1.core.Models;
using WebApplication1.core.Services;
using WebApplication1.core.Utility;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(UserManager<ApplicationUser> _userManager, GenerateJwtTokenService _generateJwtTokenService, IMapper _mapper, FileService _fileService, IWebHostEnvironment _env, ApplicationDbContext _context) : ControllerBase
    {

        private async Task<ApplicationUser?> GetCurrentUserAsync()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return null;
            }
            var user = await _userManager.FindByIdAsync(userId);
            return user;
        }


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
            if (dto.Name.ToUpper() == "ADMIN")
            {
                await _userManager.AddToRoleAsync(newUser, StaticRoles.Role_Admin);
            }
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


        // edit profile info(admin and self)
        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpPut("users/update/{id}")]
        public async Task<ActionResult> UpdateUserInfo([FromRoute] string id, [FromForm] EditProfileDto dto)
        {
            var loggedInUser = await GetCurrentUserAsync();
            if (loggedInUser == null) return Unauthorized(new { Message = "Please login." });

            var isAdmin = await _userManager.IsInRoleAsync(loggedInUser, StaticRoles.Role_Admin);
            if (!isAdmin && loggedInUser.Id != id) return Forbid();

            var userToUpdate = await _userManager.FindByIdAsync(id);
            if (userToUpdate == null) return NotFound(new { Message = "User not found." });

            // 更新基本字段
            if (!string.IsNullOrWhiteSpace(dto.Name)) userToUpdate.Name = dto.Name;
            if (!string.IsNullOrWhiteSpace(dto.PhoneNumber)) userToUpdate.PhoneNumber = dto.PhoneNumber;
            if (!string.IsNullOrWhiteSpace(dto.Address)) userToUpdate.Address = dto.Address;

            // 管理员更新角色
            if (isAdmin && !string.IsNullOrWhiteSpace(dto.Role))
            {
                var currentRoles = await _userManager.GetRolesAsync(userToUpdate);
                await _userManager.RemoveFromRolesAsync(userToUpdate, currentRoles);
                await _userManager.AddToRoleAsync(userToUpdate, dto.Role);
            }

            // 处理文件上传
            if (dto.File != null)
            {
                // 删除旧文件
                _fileService.DeleteFile(userToUpdate.ImageUrl);
                // 保存新更新数据
                userToUpdate.ImageUrl = await _fileService.SaveFileAsync(dto.File);
            }
            userToUpdate.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();


            return Ok(new
            {
                Name = userToUpdate.Name,
                PhoneNumber = userToUpdate.PhoneNumber,
                Address = userToUpdate.Address,
                Role = dto.Role,
                ImageUrl = userToUpdate.ImageUrl
            });
        }



        // admin only: get all users
        [Authorize(AuthenticationSchemes = "Bearer", Roles = StaticRoles.Role_Admin)]
        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<UserInfoDto>>> GetAllUsers()
        {
            var users = _userManager.Users.ToList();
            var userInfoList = new List<UserInfoDto>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                var role = roles.FirstOrDefault() ?? "No Role";
                var userInfo = _mapper.Map<UserInfoDto>(user);
                userInfo.Role = role;

                userInfoList.Add(userInfo);
            }
            return Ok(userInfoList);

        }

        // get user info(admin and self)
        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpGet("userinfo/{id}")]
        public async Task<ActionResult<UserInfoDto>> GetUserInfo([FromRoute] string id)
        {
            var loggedInUser = await GetCurrentUserAsync();
            if (loggedInUser == null)
            {
                return Unauthorized();
            }
            // logged in user can only get own info or admin can get any user info
            var isAdmin = await _userManager.IsInRoleAsync(loggedInUser, StaticRoles.Role_Admin);
            // 只有当用户既不是管理员又不是访问自己的信息时，才禁止
            if (!isAdmin && loggedInUser.Id != id)
            {
                return Forbid();
            }

            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            var roles = await _userManager.GetRolesAsync(user);
            var role = roles.FirstOrDefault() ?? "No Role";
            var userInfo = _mapper.Map<UserInfoDto>(user);
            userInfo.Role = role;
            return Ok(userInfo);
        }

        // admin only: delete user
        [Authorize(AuthenticationSchemes = "Bearer", Roles = StaticRoles.Role_Admin)]
        [HttpDelete("users/delete/{id}")]
        public async Task<ActionResult> DeleteUser([FromRoute] string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound(new
                {
                    Message = "User not found."
                });
            }
            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(new
                {
                    Message = "Failed to delete user."
                });
            }

            return Ok(new
            {
                Message = "User deleted successfully."
            });

        }
    }
}
