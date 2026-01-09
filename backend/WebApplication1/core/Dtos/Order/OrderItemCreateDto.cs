using System.ComponentModel.DataAnnotations;

namespace WebApplication1.core.Dtos.Order
{
    public class OrderItemCreateDto
    {
        [Required]
        public int Quantity { get; set; }
        [Required]
        public string ItemName { get; set; } = "";
        [Required]
        public double Price { get; set; }
        public string MenuItemId { get; set; } = "";

    }
}