

using System.ComponentModel.DataAnnotations;

namespace WebApplication1.core.Dtos.Auth
{
    public class RegisterRequestDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
        [Required]
        public string Name { get; set; } = "";
    }
}