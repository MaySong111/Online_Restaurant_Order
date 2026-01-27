namespace WebApplication1.core.Dtos.Auth
{
    public class EditProfileDto
    {
        public string? Name { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
        public string Role { get; set; }
        public IFormFile? File { get; set; }
    }
}