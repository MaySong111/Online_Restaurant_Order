using System.ComponentModel.DataAnnotations;

namespace WebApplication1.core.Models
{
    public class MenuItem
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Name { get; set; } = "";
        public string? Description { get; set; }
        public string Category { get; set; } = "";
        public string? SpecialTag { get; set; }
        [Range(1, 1000)]
        public double Price { get; set; }
        public string ImageUrl { get; set; } = "";
        // average rating mark
        public double AverageRating { get; set; }
        // total number of reviews
        public int TotalReviews { get; set; }
    }
}