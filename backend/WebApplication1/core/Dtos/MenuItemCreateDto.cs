using System.ComponentModel.DataAnnotations;

namespace WebApplication1.core.Dtos
{
    public class MenuItemCreateDto
    {
        [Required]
        public string Name { get; set; } = "";
        public string? Description { get; set; }
        public string Category { get; set; } = "";
        public string? SpecialTag { get; set; }
        [Range(1, 1000)]
        public double Price { get; set; }
        public IFormFile File { get; set; } = null!;
    }
}