using Microsoft.AspNetCore.Identity;

namespace WebApplication1.core.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string Name { get; set; } = "";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public string Address { get; set; } = "";
        public string ImageUrl { get; set; } = "";
    }
}