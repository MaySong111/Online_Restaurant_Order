using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.core.DbData;
using WebApplication1.core.Dtos;
using WebApplication1.core.Dtos.Menu;
using WebApplication1.core.Menu.Dtos;
using WebApplication1.core.Models;
using WebApplication1.core.Services;
using WebApplication1.core.Utility;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MenuItemController(ApplicationDbContext _context, IMapper _mapper, FileService _fileService, IWebHostEnvironment _env) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MenuItemDto>>> GetMenuItems([FromQuery] string? category,
       [FromQuery] string? sortBy,
       [FromQuery] string? search)
        {
            var query = _context.MenuItems.AsQueryable();
            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(mi => mi.Category == category);
            }
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(mi => mi.Name.Contains(search) || mi.Description.Contains(search));
            }

            query = sortBy?.ToLower() switch
            {
                "price_asc" => query.OrderBy(mi => mi.Price),
                "price_desc" => query.OrderByDescending(mi => mi.Price),
                "name_asc" => query.OrderBy(mi => mi.Name),
                "name_desc" => query.OrderByDescending(mi => mi.Name),
                _ => query.OrderByDescending(mi => mi.Id),
            };

            var menuItems = await query.ToListAsync();
            return Ok(_mapper.Map<List<MenuItemDto>>(menuItems));
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<MenuItemDto>> GetMenuItem(string id)
        {
            var menuItem = await _context.MenuItems.FindAsync(id);
            if (menuItem == null)
            {
                return NotFound();
            }
            return Ok(_mapper.Map<MenuItemDto>(menuItem));
        }


        [Authorize(AuthenticationSchemes = "Bearer", Roles = StaticRoles.Role_Admin)]
        [HttpPost("create")]
        public async Task<ActionResult> CreateMenuItem([FromForm] MenuItemCreateDto dto)
        {
            string imageUrl = null;
            if (dto.File != null)
            {
                imageUrl = await _fileService.SaveFileAsync(dto.File);
            }

            var newMenuItem = _mapper.Map<MenuItem>(dto);
            newMenuItem.ImageUrl = imageUrl;

            _context.MenuItems.Add(newMenuItem);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Menu item created successfully."
            });
        }



        [Authorize(AuthenticationSchemes = "Bearer", Roles = StaticRoles.Role_Admin)]
        [HttpPut("update/{id}")]
        public async Task<ActionResult> UpdateMenuItem([FromRoute] string id, [FromForm] MenuItemUpdateDto dto)
        {
            var existingMenuItem = await _context.MenuItems.FindAsync(id);
            if (existingMenuItem == null)
                return NotFound();

            if (dto.File != null)
            {
                // 删除旧文件
                _fileService.DeleteFile(existingMenuItem.ImageUrl);

                // 保存新文件
                existingMenuItem.ImageUrl = await _fileService.SaveFileAsync(dto.File);
            }

            _mapper.Map(dto, existingMenuItem);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Menu item updated successfully."
            });
        }


        [Authorize(AuthenticationSchemes = "Bearer", Roles = StaticRoles.Role_Admin)]
        [HttpDelete("delete/{id}")]
        public async Task<ActionResult<ApiResponseDto<object?>>> DeleteMenuItem([FromRoute] string id)
        {
            var existingMenuItem = await _context.MenuItems.FindAsync(id);
            if (existingMenuItem == null)
            {
                return NotFound();
            }
            // 1. delete the image file from folder
            var filePath_oldFile = Path.Combine(_env.WebRootPath, existingMenuItem.ImageUrl);
            if (System.IO.File.Exists(filePath_oldFile))
            {
                System.IO.File.Delete(filePath_oldFile);
            }

            // 2. remove the data from database
            _context.MenuItems.Remove(existingMenuItem);
            await _context.SaveChangesAsync();
            return Ok(new ApiResponseDto<object?>
            {
                Message = "Menu item deleted successfully."
            });
        }



        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpPost("toggle-like/{menuItemId}")]
        public async Task<ActionResult> ToggleLike(string menuItemId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized(new { Message = "Please log in to like a menu item." });
            }

            var existingLike = await _context.UserLikes
                .FirstOrDefaultAsync(ul => ul.UserId == userId && ul.MenuItemId == menuItemId);

            var menuItem = await _context.MenuItems.FindAsync(menuItemId);
            if (menuItem == null)
            {
                return NotFound(new { Message = "Menu item not found." });
            }


            if (existingLike != null)
            {
                // User has already liked the item, so remove the like(已点赞 → 取消点赞)
                _context.UserLikes.Remove(existingLike);
                menuItem.LikesCount -= 1;
            }
            else
            {
                // 未点赞 → 点赞
                _context.UserLikes.Add(new UserLike
                {
                    UserId = userId,
                    MenuItemId = menuItemId
                });
                menuItem.LikesCount += 1;
            }
            await _context.SaveChangesAsync();
            return Ok(new { LikesCount = menuItem.LikesCount });
        }
    }
}