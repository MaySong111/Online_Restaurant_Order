namespace WebApplication1.core.Dtos.Order
{
    public class OrderItemDto
    {
        public string Id { get; set; }
        public string ItemName { get; set; }
        public double Price { get; set; }
        public int Quantity { get; set; }
        public int? Rating { get; set; }
    }
}