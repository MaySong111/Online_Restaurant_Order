using System.ComponentModel.DataAnnotations;

namespace WebApplication1.core.Dtos.Order
{
    public class OrderDto
    {
        public string Id { get; set; }
        [Required]
        public string PickUpName { get; set; }
        [Required]
        public string PickUpPhoneNumber { get; set; }
        [Required]
        public string PickUpEmail { get; set; }
        public double OrderTotal { get; set; }
        public string Status { get; set; }
        public int TotalItem { get; set; }
        public DateTime OrderDate { get; set; }
        // navigation property
        public List<OrderItemDto> OrderItems { get; set; } = new List<OrderItemDto>();

    }
}