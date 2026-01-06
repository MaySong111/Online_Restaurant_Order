
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.core.DbData;
using WebApplication1.core.Dtos;
using WebApplication1.core.Models;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MenuItemController(ApplicationDbContext _context, IWebHostEnvironment env, IMapper _mapper) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetMenuItems()
        {
            var menuItems = _context.MenuItems.ToList();
            return Ok(menuItems);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetMenuItem(int id)
        {
            var menuItem = await _context.MenuItems.FindAsync(id);
            if (menuItem == null)
            {
                return NotFound();
            }
            return Ok(menuItem);
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponseDto<object?>>> CreateMenuItem([FromForm] MenuItemCreateDto dto)
        {
            // 1. validate the format of the file(png,jpg,jpeg,gif)
            var allowedExtensions = new[] { ".png", ".jpg", ".jpeg", ".gif" };
            var fileExtension = Path.GetExtension(dto.File.FileName).ToLower();
            if (!allowedExtensions.Contains(fileExtension))
            {
                return BadRequest(new ApiResponseDto<object?>
                {
                    Message = "Invalid input data.",
                    ErrorMessages = new List<string> { "Invalid file format. Only PNG, JPG, JPEG, and GIF are allowed." }
                });
            }

            // 2.check if the file is null or empty
            if (dto.File == null || dto.File.Length == 0)
            {
                return BadRequest(new ApiResponseDto<object?>
                {
                    Message = "Invalid input data.",
                    ErrorMessages = new List<string> { "File is required." }
                });
            }
            // 3.need to create a folder named images in wwwroot,so we can save the image there
            var imagesPath = Path.Combine(env.WebRootPath, "images");
            // if the above folder does not exist, create it
            if (!Directory.Exists(imagesPath))
            {
                Directory.CreateDirectory(imagesPath);
            }
            // 4.check if the file exists already,delete it, and then save the new file(uploaded file)
            if (System.IO.File.Exists(Path.Combine(imagesPath, dto.File.FileName)))
            {
                System.IO.File.Delete(Path.Combine(imagesPath, dto.File.FileName));
            }
            var filePath = Path.Combine(imagesPath, dto.File.FileName);
            // 5.upload the file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await dto.File.CopyToAsync(stream);
            }

            // 6.save the menu item to the database
            var newMenuItem = _mapper.Map<MenuItem>(dto);
            newMenuItem.ImageUrl = Path.Combine("images", dto.File.FileName);


            _context.MenuItems.Add(newMenuItem);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetMenuItem), new { id = newMenuItem.Id }, new ApiResponseDto<object?>
            {
                Message = "Menu item created successfully."
            });
        }
    }
}