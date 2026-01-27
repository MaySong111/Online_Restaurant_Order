using System.ComponentModel.DataAnnotations;

namespace WebApplication1.core.Dtos.Order
{
    public class OrderCreateDto
    {
       
        public required string PickUpName { get; set; }
       
        public required string PickUpPhoneNumber { get; set; }
        public required string PickUpEmail { get; set; }
        public double OrderTotal { get; set; }
        public int TotalItem { get; set; }
        public List<OrderItemCreateDto> OrderItems { get; set; } = new List<OrderItemCreateDto>();
    }
}