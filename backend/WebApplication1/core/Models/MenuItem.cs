using System.ComponentModel.DataAnnotations;

namespace WebApplication1.core.Models
{
    public class MenuItem
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string Description { get; set; } = "";
        public string Category { get; set; } = "";
        public string SpecialTag { get; set; } = "";
        [Range(1, 1000)]
        public double Price { get; set; }
        public string ImageUrl { get; set; } = "";
    }
}