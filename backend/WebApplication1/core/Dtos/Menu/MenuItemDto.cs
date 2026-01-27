using System.ComponentModel.DataAnnotations;

namespace WebApplication1.core.Dtos.Menu
{
    public class MenuItemDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string SpecialTag { get; set; }
        [Range(1, 1000)]
        public double Price { get; set; }
        public string ImageUrl { get; set; }
        public int LikesCount { get; set; }
        public double AverageRating { get; set; }
        public int TotalReviews { get; set; }
    }
}