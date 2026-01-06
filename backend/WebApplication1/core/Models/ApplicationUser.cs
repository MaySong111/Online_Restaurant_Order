using Microsoft.AspNetCore.Identity;

namespace WebApplication1.core.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string Name { get; set; } = "";
    }
}