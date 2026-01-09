using System.ComponentModel.DataAnnotations;

namespace WebApplication1.core.Dtos.Order
{
    public class OrderCreateDto
    {
        [Required]
        public string PickUpName { get; set; } = "";
        [Required]
        public string PickUpPhoneNumber { get; set; } = "";
        [Required]
        public string PickUpEmail { get; set; } = "";
        public double OrderTotal { get; set; }
        public int TotalItem { get; set; }
        public List<OrderItemCreateDto> OrderItems { get; set; } = new List<OrderItemCreateDto>();
    }
}