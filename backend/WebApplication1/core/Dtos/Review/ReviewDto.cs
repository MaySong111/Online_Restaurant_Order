using System.ComponentModel.DataAnnotations;


namespace WebApplication1.core.Dtos.Review
{
    public class ReviewDto
    {
        [Required]
        [Range(1, 5)]
        public int Rating { get; set; }
    }
}